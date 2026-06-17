from datetime import date
from functools import wraps
import base64
import hashlib
import hmac
import json
import os
import re
import time
from urllib import error as urlerror
from urllib import request as urlrequest

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

import content
from cv_data import DEFAULT_CV_DATA
from seed_content import SITE as DEFAULT_SITE_DATA

load_dotenv()

app = Flask(__name__)

allowed_origins = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]
if allowed_origins:
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)

ADMIN_COOKIE_NAME = "admin_token"
ADMIN_COOKIE_PATH = "/api"
LOGIN_WINDOW_SECONDS = 15 * 60
LOGIN_MAX_FAILURES = 5
TOKEN_TTL_SECONDS = 12 * 60 * 60
_login_failures = {}

MONTHS_PT = {
    1: "JAN",
    2: "FEV",
    3: "MAR",
    4: "ABR",
    5: "MAI",
    6: "JUN",
    7: "JUL",
    8: "AGO",
    9: "SET",
    10: "OUT",
    11: "NOV",
    12: "DEZ",
}


def token_secret():
    return os.environ["ADMIN_TOKEN_SECRET"].encode()


def create_token():
    payload = json.dumps({"exp": int(time.time()) + TOKEN_TTL_SECONDS}).encode()
    payload_b64 = base64.urlsafe_b64encode(payload).rstrip(b"=")
    sig = hmac.new(token_secret(), payload_b64, hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(sig).rstrip(b"=")
    return f"{payload_b64.decode()}.{sig_b64.decode()}"


def verify_token(token):
    try:
        payload_b64, sig_b64 = token.split(".")
        expected_sig = hmac.new(token_secret(), payload_b64.encode(), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).rstrip(b"=").decode()
        if not hmac.compare_digest(sig_b64, expected_sig_b64):
            return False
        payload = json.loads(base64.urlsafe_b64decode(payload_b64 + "=="))
        return payload["exp"] > time.time()
    except Exception:
        return False


def admin_cookie_secure():
    return os.environ.get("ADMIN_COOKIE_SECURE", "").lower() == "true"


def admin_cookie_samesite():
    return "None" if admin_cookie_secure() else "Lax"


def client_ip():
    if request.access_route:
        return request.access_route[0]
    return request.remote_addr or "unknown"


def too_many_login_failures(ip):
    now = time.time()
    failures = [ts for ts in _login_failures.get(ip, []) if now - ts < LOGIN_WINDOW_SECONDS]
    _login_failures[ip] = failures
    return len(failures) >= LOGIN_MAX_FAILURES


def record_login_failure(ip):
    now = time.time()
    failures = [ts for ts in _login_failures.get(ip, []) if now - ts < LOGIN_WINDOW_SECONDS]
    failures.append(now)
    _login_failures[ip] = failures


def is_admin_request():
    token = request.cookies.get(ADMIN_COOKIE_NAME, "")
    return bool(token and verify_token(token))


def unauthorized():
    return jsonify({"error": "unauthorized"}), 401


def require_admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not is_admin_request():
            return unauthorized()
        return fn(*args, **kwargs)

    return wrapper


def cv_data_source():
    return content.get_block("cv_data", DEFAULT_CV_DATA) or DEFAULT_CV_DATA


def save_cv_data(data):
    content.set_block("cv_data", data)


def parse_iso_date(value, fallback=None):
    try:
        year, month, day = [int(part) for part in str(value).split("-")]
        return date(year, month, day)
    except Exception:
        return fallback


def calcular_idade(nascimento):
    hoje = date.today()
    idade = hoje.year - nascimento.year
    if (hoje.month, hoje.day) < (nascimento.month, nascimento.day):
        idade -= 1
    return idade


def calcular_experiencia(inicio):
    hoje = date.today()
    meses = (hoje.year - inicio.year) * 12 + (hoje.month - inicio.month)
    if hoje.day < inicio.day:
        meses -= 1
    anos, meses_restantes = divmod(max(meses, 0), 12)
    if meses_restantes >= 6:
        anos += 1
    return f"{anos} ano{'s' if anos != 1 else ''}"


def split_tags(value):
    if isinstance(value, list):
        return {str(tag).strip().lower() for tag in value if str(tag).strip()}
    return {tag.strip().lower() for tag in str(value or "").split(";") if tag.strip()}


def profile_config(cv_data, perfil):
    perfis = cv_data.get("perfis") or {}
    return perfis.get(perfil) or perfis.get("finops") or {}


def profile_tags(cv_data, perfil):
    tags = split_tags(profile_config(cv_data, perfil).get("tags"))
    return tags or {perfil}


def matches_profile(item, tags):
    item_tags = split_tags(item.get("tags"))
    return not item_tags or bool(item_tags & tags)


def filtered_certifications(cv_data, perfil):
    tags = profile_tags(cv_data, perfil)
    certs = [cert for cert in cv_data.get("certificacoes", []) if matches_profile(cert, tags)]
    return sorted(certs, key=lambda cert: int(cert.get("ano") or 0), reverse=True)


EXTENDED_EXPERIENCE_TAGS = {
    "dev": {"dados", "automacao", "governance", "projetos", "dev", "finops", "ai", "inovacao"},
    "dados": {"dados", "automacao", "governance", "projetos", "dev", "finops", "ai", "inovacao"},
}


def experience_tags_for_filter(cv_data, perfil):
    tags = profile_tags(cv_data, perfil)
    extra = EXTENDED_EXPERIENCE_TAGS.get(perfil)
    if extra:
        tags = tags | extra
    return tags


def filtered_experiences(cv_data, perfil):
    tags = experience_tags_for_filter(cv_data, perfil)
    selected = [exp for exp in cv_data.get("experiencias", []) if matches_profile(exp, tags)]
    return sorted(
        selected,
        key=lambda exp: (int(exp.get("ano_inicio") or 0), int(exp.get("mes_inicio") or 0)),
        reverse=True,
    )


def is_extra_experience(cv_data, perfil, exp):
    extra = EXTENDED_EXPERIENCE_TAGS.get(perfil)
    if not extra:
        return False
    own_tags = profile_tags(cv_data, perfil)
    item_tags = split_tags(exp.get("tags"))
    return bool(item_tags) and not (item_tags & own_tags)


def effective_period(cv_data, perfil, exp):
    if is_extra_experience(cv_data, perfil, exp):
        return "ATUAL"
    return format_period(exp)


def format_period(exp):
    start_month = MONTHS_PT.get(int(exp.get("mes_inicio") or 0), "")
    start_year = str(exp.get("ano_inicio") or "")
    end_month_raw = exp.get("mes_fim")
    end_year_raw = exp.get("ano_fim")
    if end_month_raw == "-" or end_year_raw == "-":
        end = "ATUAL"
    else:
        end_month = MONTHS_PT.get(int(end_month_raw or 0), "")
        end = f"{end_month}/{end_year_raw}".strip("/")
    return f"{start_month}/{start_year} - {end}".strip(" -")


def site_filosofia(site_data, perfil):
    site_perfil = (site_data or {}).get(perfil) or {}
    default_perfil = DEFAULT_SITE_DATA.get(perfil) or {}

    if perfil == "dados":
        paragraphs = site_perfil.get("dadosFilosofia") or default_perfil.get("dadosFilosofia") or []
        text = "\n\n".join(p.strip() for p in paragraphs if p and p.strip())
        return text or None

    text = (
        (site_perfil.get("filosofia") or {}).get("text")
        or (default_perfil.get("filosofia") or {}).get("text")
    )
    return text


PROFILE_TECH_GROUPS_KEY = {
    "finops": "techGroups",
    "dev": "devTechGroups",
    "dados": "dadosTechGroups",
}


def stack_titles_for_profile(site_data, perfil):
    key = PROFILE_TECH_GROUPS_KEY.get(perfil)
    if not key:
        return []
    groups = ((site_data or {}).get(perfil) or {}).get(key)
    if not groups:
        groups = (DEFAULT_SITE_DATA.get(perfil) or {}).get(key, [])
    return [group.get("title") for group in groups if group.get("title")]


def stack_items_for_profile(site_data, perfil):
    key = PROFILE_TECH_GROUPS_KEY.get(perfil)
    if not key:
        return []
    groups = ((site_data or {}).get(perfil) or {}).get(key)
    if not groups:
        groups = (DEFAULT_SITE_DATA.get(perfil) or {}).get(key, [])
    items = []
    for group in groups:
        for item in group.get("items") or []:
            if item and item not in items:
                items.append(item)
    return items


def stack_groups_for_profile(site_data, perfil):
    key = PROFILE_TECH_GROUPS_KEY.get(perfil)
    if not key:
        return []
    groups = ((site_data or {}).get(perfil) or {}).get(key)
    if not groups:
        groups = (DEFAULT_SITE_DATA.get(perfil) or {}).get(key, [])
    return [
        {"title": group.get("title"), "items": group.get("items") or []}
        for group in groups
        if group.get("title")
    ]


def profile_competencies(cv_data, perfil, site_data=None):
    titles = stack_titles_for_profile(site_data, perfil)
    if titles:
        return titles
    perfil_data = profile_config(cv_data, perfil)
    return perfil_data.get("competencias") or cv_data.get("competencias", [])


def experience_description(exp, perfil):
    return (exp.get("descricoes_ia") or {}).get(perfil) or exp.get("descricao")


@app.route("/api/cv-data")
def cv_data_json():
    perfil = request.args.get("perfil", "finops")
    cv_data = cv_data_source()
    personal = cv_data.get("dados_pessoais") or {}
    perfil_data = profile_config(cv_data, perfil)
    nascimento = parse_iso_date(personal.get("nascimento"), date(1995, 2, 4))

    earliest_ano_inicio = {}
    for exp in cv_data.get("experiencias", []):
        inst = exp.get("instituicao")
        ano = exp.get("ano_inicio")
        if inst and ano and (inst not in earliest_ano_inicio or int(ano) < int(earliest_ano_inicio[inst])):
            earliest_ano_inicio[inst] = ano

    experiencias = []
    for exp in filtered_experiences(cv_data, perfil):
        experiencias.append({
            "cargo": exp.get("cargo"),
            "funcao": exp.get("funcao"),
            "instituicao": exp.get("instituicao"),
            "setor": exp.get("setor"),
            "ano_inicio": exp.get("ano_inicio"),
            "ano_inicio_instituicao": earliest_ano_inicio.get(exp.get("instituicao")),
            "ano_fim": exp.get("ano_fim"),
            "periodo": effective_period(cv_data, perfil, exp),
            "descricao": experience_description(exp, perfil),
            "enriquecimento": (exp.get("enriquecimento_ia") or {}).get(perfil),
        })

    certificacoes = [
        {
            "titulo": cert.get("titulo"),
            "instituicao": cert.get("instituicao"),
            "ano": cert.get("ano"),
        }
        for cert in filtered_certifications(cv_data, perfil)
    ]

    educacao = [
        {
            "curso": edu.get("curso"),
            "instituicao": edu.get("instituicao"),
            "categoria": edu.get("categoria"),
            "duracao_num": edu.get("duracao_num"),
            "duracao_tempo": edu.get("duracao_tempo"),
            "status": edu.get("status"),
            "ano_fim": str(edu.get("fim") or "").split("-")[0],
        }
        for edu in cv_data.get("dados_educacao", [])
    ]

    location = " / ".join(
        part for part in [personal.get("cidade"), personal.get("estado"), personal.get("pais")] if part
    )

    site_data = content.get_block("site", {})

    return jsonify({
        "nome": personal.get("nome") or "Geisa dos Reis",
        "idade": calcular_idade(nascimento),
        "resumo_formacao": personal.get("resumo_formacao"),
        "telefone": personal.get("telefone"),
        "email": personal.get("email"),
        "location": location,
        "linkedin": personal.get("linkedin"),
        "linkedin_label": personal.get("linkedin_label") or personal.get("linkedin"),
        "github": personal.get("github"),
        "role": perfil_data.get("role"),
        "filosofia": site_filosofia(site_data, perfil) or perfil_data.get("filosofia"),
        "habilidades": stack_items_for_profile(site_data, perfil) or perfil_data.get("habilidades", []),
        "habilidades_grupos": stack_groups_for_profile(site_data, perfil),
        "competencias": profile_competencies(cv_data, perfil, site_data),
        "experiencias": experiencias,
        "certificacoes": certificacoes,
        "educacao": educacao,
    })


def text_preview(value, limit=900):
    text = " ".join(str(value or "").split())
    if len(text) <= limit:
        return text
    truncated = text[:limit]
    last_space = truncated.rfind(" ")
    if last_space > 0:
        truncated = truncated[:last_space]
    return truncated.rstrip(",;:") + "..."


def site_text_entries(value, path="site", entries=None):
    if entries is None:
        entries = []
    if isinstance(value, dict):
        title = value.get("title") or value.get("name") or value.get("heading") or value.get("impact") or path
        parts = []
        tags = []
        for key, val in value.items():
            if key in {"title", "name", "heading", "challenge", "solution", "paragraph", "quote", "description", "impact", "texto", "text"}:
                parts.append(str(val))
            elif key in {"items", "benefits", "technologies", "tags"} and isinstance(val, list):
                parts.extend(str(item) for item in val if not isinstance(item, (dict, list)))
                if key in {"technologies", "tags"}:
                    tags.extend(str(item) for item in val if not isinstance(item, (dict, list)))
            elif key == "details" and isinstance(val, dict):
                paragraphs = val.get("paragraphs")
                if isinstance(paragraphs, list):
                    parts.extend(str(item) for item in paragraphs)
                detail_tags = val.get("tags")
                if isinstance(detail_tags, list):
                    tags.extend(str(item) for item in detail_tags)
        text = text_preview(" | ".join(parts), 1200)
        if text:
            entries.append({"path": path, "title": text_preview(title, 120), "tags": tags, "text": text})
        for key, val in value.items():
            site_text_entries(val, f"{path}.{key}", entries)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            site_text_entries(item, f"{path}[{index}]", entries)
    return entries


def collect_all_text(value, path="site", entries=None, min_len=2):
    """Recursively walk any dict/list and collect every leaf string,
    regardless of key name, so new card/carousel fields are picked up
    without needing to whitelist keys."""
    if entries is None:
        entries = []
    if isinstance(value, dict):
        for key, val in value.items():
            collect_all_text(val, f"{path}.{key}", entries, min_len)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            collect_all_text(item, f"{path}[{index}]", entries, min_len)
    elif isinstance(value, str):
        text = text_preview(value, 1200)
        if len(text) >= min_len:
            entries.append({"path": path, "text": text})
    return entries


def evidence_for_profile(site_data, perfil, cv_data):
    entries = site_text_entries((site_data or {}).get(perfil) or {}, perfil)
    tags = profile_tags(cv_data, perfil)
    scored = []
    for entry in entries:
        haystack = " ".join([entry.get("title", ""), entry.get("text", ""), " ".join(entry.get("tags", []))]).lower()
        scored.append((sum(1 for tag in tags if tag in haystack), entry))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [entry for _, entry in scored[:24]]


def experiences_for_prompt(cv_data, perfil):
    selected_ids = {id(exp) for exp in filtered_experiences(cv_data, perfil)}
    result = []
    for index, exp in enumerate(cv_data.get("experiencias", [])):
        if id(exp) in selected_ids:
            result.append({
                "index": index,
                "cargo": exp.get("cargo"),
                "funcao": exp.get("funcao"),
                "instituicao": exp.get("instituicao"),
                "periodo": format_period(exp),
                "setor": exp.get("setor"),
                "tags": exp.get("tags"),
                "descricao_atual": exp.get("descricao"),
            })
    return result


def build_experience_enrichment_prompt(perfil, exp, site_evidence, periodo=None):
    payload = {
        "perfil": perfil,
        "experiencia": {
            "cargo": exp.get("cargo"),
            "funcao": exp.get("funcao"),
            "instituicao": exp.get("instituicao"),
            "setor": exp.get("setor"),
            "periodo": periodo or format_period(exp),
            "descricao": exp.get("descricao"),
        },
        "conteudo_da_pagina": site_evidence,
    }
    return (
        "Com base EXCLUSIVAMENTE nas evidências do JSON abaixo (a experiência profissional e o "
        f"conteúdo público da página do perfil '{perfil}'), gere um enriquecimento estratégico "
        "em português do Brasil para esta experiência.\n\n"
        "Responda apenas JSON válido, sem markdown, com exatamente as chaves: "
        "atuacao (string), trajetoria (string), entregas_importantes (lista de strings), em_resumo (string).\n\n"
        "Definições:\n"
        "- atuacao: principal natureza da atuação da pessoa naquele período.\n"
        "- trajetoria: como essa experiência se encaixa na evolução profissional da pessoa.\n"
        "- entregas_importantes: lista das entregas mais relevantes, baseadas apenas em evidências "
        "encontradas na experiência ou no conteúdo da página.\n"
        "- em_resumo: uma frase executiva sintetizando a principal contribuição do período.\n\n"
        "ANCORAGEM (muito importante):\n"
        "- O campo 'experiencia.periodo' e 'experiencia.descricao' são a ÂNCORA principal. Todo o "
        "conteúdo gerado deve ser específico a ESSE período e a ESSA descrição — não a outras fases "
        "da carreira.\n"
        "- 'conteudo_da_pagina' é um material amplo da página e pode conter referências a vários "
        "períodos/projetos diferentes. Use dele APENAS os trechos que sejam coerentes com o período "
        "e a descrição desta experiência específica; ignore o que pertencer a outras fases.\n"
        "- Evite frases genéricas que serviriam para qualquer experiência da pessoa (ex: 'atuei "
        "conectando dados, tecnologia e negócio'). Seja concreto e amarrado ao que a descrição "
        "desta experiência diz.\n"
        "- Cada experiência deve resultar em um texto distinto das demais — não repita as mesmas "
        "frases ou estrutura usadas para outros períodos.\n\n"
        "PESSOA GRAMATICAL (muito importante):\n"
        "- Sempre que o texto se referir a ações realizadas pela pessoa (ex: 'liderou', 'desenvolveu', "
        "'conduziu', 'estruturou'), escreva em primeira pessoa do singular (ex: 'liderei', "
        "'desenvolvi', 'conduzi', 'estruturei'). Nunca use terceira pessoa para descrever as ações "
        "da própria pessoa.\n\n"
        "EXPERIÊNCIA ATUAL ('ATUAL' em periodo):\n"
        "- Se 'experiencia.periodo' indicar que esta é a experiência em andamento (contém 'ATUAL'), "
        "construa o enriquecimento considerando também a trajetória, experiências e entregas "
        "anteriores, mas sob a ótica e o foco da área do perfil indicado (ex: dev, finops, dados), "
        "destacando como esse histórico converge para a atuação atual.\n\n"
        "Restrições importantes:\n"
        "- NÃO altere ou reescreva cargo, função, datas, descrição existente, habilidades, "
        "certificações ou competências — você não tem acesso a esses campos para edição.\n"
        "- NÃO invente projetos, produtos, tecnologias, métricas ou resultados que não estejam "
        "nas evidências.\n"
        "- Em caso de dúvida, seja conservadora e omita (liste menos entregas, ou deixe campos "
        "mais curtos) em vez de inventar.\n"
        "- Use apenas o conteúdo da página do perfil indicado; não misture com outros perfis.\n\n"
        f"{json.dumps(payload, ensure_ascii=False)}"
    )


def generate_experience_summary(perfil, exp, site_data, cv_data=None):
    site_evidence = [e["text"] for e in collect_all_text((site_data or {}).get(perfil) or {})]
    periodo = effective_period(cv_data, perfil, exp) if cv_data is not None else None
    prompt = build_experience_enrichment_prompt(perfil, exp, site_evidence, periodo=periodo)
    raw = call_ai_json(prompt)
    return {
        "atuacao": text_preview(raw.get("atuacao")),
        "trajetoria": text_preview(raw.get("trajetoria")),
        "entregas_importantes": [
            text_preview(item) for item in raw.get("entregas_importantes", []) if text_preview(item)
        ],
        "em_resumo": text_preview(raw.get("em_resumo")),
        "generated_at": int(time.time()),
    }


def build_cv_ai_prompt(perfil, cv_data, site_data, prompt_override=None):
    perfil_data = profile_config(cv_data, perfil)
    payload = {
        "perfil": perfil,
        "role": perfil_data.get("role"),
        "prompt_usuario": prompt_override if prompt_override is not None else (perfil_data.get("prompt_ia") or ""),
        "tags_do_perfil": list(profile_tags(cv_data, perfil)),
        "regras": {
            "sem_ia": ["sobre_mim", "contato", "certificacoes", "educacao", "cabecalhos_de_experiencia"],
            "com_ia": ["competencias", "filosofia", "descricoes_de_experiencia", "habilidades"],
        },
        "experiencias_base": experiences_for_prompt(cv_data, perfil),
        "conteudo_publico_do_site": evidence_for_profile(site_data, perfil, cv_data),
    }
    return (
        "Gere sugestões curtas para um CV em português do Brasil com base no JSON abaixo. "
        "Responda somente JSON válido, sem markdown, com as chaves: competencias, filosofia, habilidades, experiencias. "
        "Limites: competencias até 5 itens; habilidades até 8 itens; filosofia até 600 caracteres; "
        "experiencias deve conter no máximo 5 objetos {index, resumo}, cada resumo até 280 caracteres. "
        "Siga também o campo prompt_usuario quando ele existir. "
        "Não invente fatos nem métricas.\n\n"
        f"{json.dumps(payload, ensure_ascii=False)}"
    )


def call_gemini_json(prompt):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY não está configurada.")
    model = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    payload = {
        "system_instruction": {"parts": [{"text": "Você é uma redatora técnica de currículos. Responda apenas JSON válido. Use somente as evidências fornecidas."}]},
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"response_mime_type": "application/json", "temperature": 0.1, "maxOutputTokens": 2600},
    }
    req = urlrequest.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
        method="POST",
    )
    try:
        with urlrequest.urlopen(req, timeout=90) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except urlerror.HTTPError as exc:
        try:
            body = json.loads(exc.read().decode("utf-8"))
            message = ((body.get("error") or {}).get("message")) or str(exc)
        except Exception:
            message = str(exc)
        raise RuntimeError(f"Gemini retornou erro: {message}") from exc
    except urlerror.URLError as exc:
        raise RuntimeError("Gemini não respondeu. Verifique conexão e chave de API.") from exc
    finish_reason = (raw.get("candidates") or [{}])[0].get("finishReason")
    if finish_reason and finish_reason not in {"STOP", "MAX_TOKENS"}:
        raise RuntimeError(f"Gemini interrompeu a resposta: {finish_reason}")
    parts = (((raw.get("candidates") or [{}])[0].get("content") or {}).get("parts") or [])
    text = "".join(part.get("text", "") for part in parts).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Gemini retornou JSON incompleto. Tente gerar novamente ou use um modelo com limite maior.") from exc


def call_ollama_json(prompt):
    url = os.environ.get("OLLAMA_URL", "http://localhost:11434").rstrip("/") + "/api/chat"
    payload = {
        "model": os.environ.get("OLLAMA_MODEL", "llama3.1:8b"),
        "stream": False,
        "format": "json",
        "messages": [
            {"role": "system", "content": "Você é uma redatora técnica de currículos. Responda apenas JSON válido."},
            {"role": "user", "content": prompt},
        ],
    }
    req = urlrequest.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urlrequest.urlopen(req, timeout=90) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except urlerror.URLError as exc:
        raise RuntimeError("Ollama não respondeu. Verifique se o serviço local está rodando.") from exc
    return json.loads(((raw.get("message") or {}).get("content") or "").strip())


def call_groq_json(prompt):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY não está configurada.")
    model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
    url = "https://api.groq.com/openai/v1/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "Você é uma redatora técnica de currículos. Responda apenas JSON válido. Use somente as evidências fornecidas."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.1,
        "response_format": {"type": "json_object"},
    }
    for attempt in range(4):
        req = urlrequest.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}", "User-Agent": "Mozilla/5.0"},
            method="POST",
        )
        try:
            with urlrequest.urlopen(req, timeout=90) as response:
                raw = json.loads(response.read().decode("utf-8"))
            break
        except urlerror.HTTPError as exc:
            try:
                body = json.loads(exc.read().decode("utf-8"))
                message = ((body.get("error") or {}).get("message")) or str(exc)
            except Exception:
                message = str(exc)
            if exc.code == 429 and attempt < 3:
                match = re.search(r"try again in ([\d.]+)s", message)
                wait = float(match.group(1)) if match else 5.0
                time.sleep(wait + 0.5)
                continue
            raise RuntimeError(f"Groq retornou erro: {message}") from exc
        except urlerror.URLError as exc:
            raise RuntimeError("Groq não respondeu. Verifique conexão e chave de API.") from exc
    text = ((raw.get("choices") or [{}])[0].get("message") or {}).get("content", "").strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Groq retornou JSON incompleto. Tente gerar novamente.") from exc


def call_ai_json(prompt):
    provider = os.environ.get("AI_PROVIDER", "").strip().lower()
    if not provider:
        provider = "gemini" if os.environ.get("GEMINI_API_KEY") else "ollama"
    if provider == "gemini":
        return call_gemini_json(prompt)
    if provider == "groq":
        return call_groq_json(prompt)
    if provider == "ollama":
        return call_ollama_json(prompt)
    raise RuntimeError("AI_PROVIDER deve ser 'gemini', 'groq' ou 'ollama'.")


def normalize_ai_suggestion(raw, cv_data, perfil):
    valid_indexes = {item["index"] for item in experiences_for_prompt(cv_data, perfil)}
    experiences = []
    for item in raw.get("experiencias", []):
        try:
            index = int(item.get("index"))
        except Exception:
            continue
        resumo = text_preview(item.get("resumo"), 650)
        if index in valid_indexes and resumo:
            experiences.append({"index": index, "resumo": resumo})
    provider = os.environ.get("AI_PROVIDER") or ("gemini" if os.environ.get("GEMINI_API_KEY") else "ollama")
    return {
        "competencias": [text_preview(item, 90) for item in raw.get("competencias", []) if text_preview(item, 90)][:6],
        "filosofia": text_preview(raw.get("filosofia"), 950),
        "habilidades": [text_preview(item, 90) for item in raw.get("habilidades", []) if text_preview(item, 90)][:10],
        "experiencias": experiences,
        "provider": provider,
        "model": os.environ.get("GEMINI_MODEL") if provider == "gemini" else os.environ.get("OLLAMA_MODEL", "llama3.1:8b"),
        "generated_at": int(time.time()),
    }


def apply_cv_ai_suggestion(cv_data, perfil):
    suggestion = ((cv_data.get("ai_suggestions") or {}).get(perfil) or {})
    if not suggestion:
        return False
    perfil_data = cv_data.setdefault("perfis", {}).setdefault(perfil, {})
    if suggestion.get("competencias"):
        perfil_data["competencias"] = suggestion["competencias"]
    if suggestion.get("filosofia"):
        perfil_data["filosofia"] = suggestion["filosofia"]
    if suggestion.get("habilidades"):
        perfil_data["habilidades"] = suggestion["habilidades"]
    experiencias = cv_data.get("experiencias", [])
    for item in suggestion.get("experiencias", []):
        index = item.get("index")
        if isinstance(index, int) and 0 <= index < len(experiencias):
            experiencias[index].setdefault("descricoes_ia", {})[perfil] = item.get("resumo")
    return True


@app.route("/api/perfil")
def perfil():
    cv_data = cv_data_source()
    personal = cv_data.get("dados_pessoais") or {}
    site = content.get_block("site", {}) or {}
    starts = {
        "finops": date(2023, 5, 1),
        "dev": date(2020, 1, 1),
        "dados": date(2020, 1, 1),
    }
    perfis = {
        "finops": {
            "titulo": "FinOps",
            "resumo": "Gestão e otimização de custos em nuvem.",
            "skills": profile_config(cv_data, "finops").get("habilidades") or [],
            "experiencia": calcular_experiencia(starts["finops"]),
            "certificacoes": [
                {"nome": cert.get("titulo"), "desde": str(cert.get("ano"))}
                for cert in filtered_certifications(cv_data, "finops")[:4]
            ],
        },
        "dev": {
            "titulo": "Application Development",
            "resumo": "Desenvolvimento de aplicações corporativas.",
            "skills": profile_config(cv_data, "dev").get("habilidades") or [],
            "experiencia": calcular_experiencia(starts["dev"]),
            "certificacoes": [
                {"nome": cert.get("titulo"), "desde": str(cert.get("ano"))}
                for cert in filtered_certifications(cv_data, "dev")[:4]
            ],
        },
        "dados": {
            "titulo": "Data Science",
            "resumo": "Dados, analytics e IA aplicada.",
            "skills": profile_config(cv_data, "dados").get("habilidades") or [],
            "experiencia": calcular_experiencia(starts["dados"]),
            "certificacoes": [
                {"nome": cert.get("titulo"), "desde": str(cert.get("ano"))}
                for cert in filtered_certifications(cv_data, "dados")[:4]
            ],
        },
    }
    for key, override in (site.get("perfis") or {}).items():
        perfis.setdefault(key, {}).update(override)
        perfis[key].setdefault("skills", [])
    ordem = [key for key in site.get("ordem", ["finops", "dev", "dados"]) if not perfis.get(key, {}).get("hidden")]
    nascimento = parse_iso_date(personal.get("nascimento"), date(1995, 2, 4))
    formacoes = [
        {"curso": edu.get("curso"), "anos": f"{edu.get('duracao_num')} {edu.get('duracao_tempo')}".strip()}
        for edu in cv_data.get("dados_educacao", [])
        if edu.get("categoria") == "graduação"
    ]
    return jsonify({"nome": personal.get("nome"), "idade": calcular_idade(nascimento), "formacoes": formacoes, "perfis": perfis, "ordem": ordem})


@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    ip = client_ip()
    if too_many_login_failures(ip):
        return jsonify({"error": "too many attempts"}), 429
    body = request.get_json(silent=True) or {}
    submitted_password = str(body.get("password") or "")
    expected_password = os.environ.get("ADMIN_PASSWORD") or ""
    if not expected_password or not hmac.compare_digest(submitted_password, expected_password):
        record_login_failure(ip)
        return jsonify({"error": "invalid credentials"}), 401
    _login_failures.pop(ip, None)
    response = jsonify({"authenticated": True})
    response.set_cookie(ADMIN_COOKIE_NAME, create_token(), max_age=TOKEN_TTL_SECONDS, httponly=True, secure=admin_cookie_secure(), samesite=admin_cookie_samesite(), path=ADMIN_COOKIE_PATH)
    return response


@app.route("/api/admin/me")
@require_admin
def admin_me():
    return jsonify({"authenticated": True})


@app.route("/api/admin/logout", methods=["POST"])
def admin_logout():
    response = jsonify({"ok": True})
    response.delete_cookie(ADMIN_COOKIE_NAME, path=ADMIN_COOKIE_PATH, secure=admin_cookie_secure(), samesite=admin_cookie_samesite())
    return response


@app.route("/api/admin/cv-ai/generate", methods=["POST"])
@require_admin
def generate_cv_ai():
    body = request.get_json(silent=True) or {}
    perfil = body.get("perfil", "finops")
    prompt_override = body.get("prompt_ia")
    cv_data = cv_data_source()
    if perfil not in (cv_data.get("perfis") or {}):
        return jsonify({"error": "invalid profile"}), 400
    prompt = build_cv_ai_prompt(perfil, cv_data, content.get_block("site", {}) or {}, prompt_override=prompt_override)
    try:
        raw = call_ai_json(prompt)
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 502
    suggestion = normalize_ai_suggestion(raw, cv_data, perfil)
    cv_data.setdefault("ai_suggestions", {})[perfil] = suggestion
    save_cv_data(cv_data)
    return jsonify({"ok": True, "perfil": perfil, "suggestion": suggestion, "cv_data": cv_data})


@app.route("/api/admin/cv-ai/apply", methods=["POST"])
@require_admin
def apply_cv_ai():
    perfil = (request.get_json(silent=True) or {}).get("perfil", "finops")
    cv_data = cv_data_source()
    if perfil not in (cv_data.get("perfis") or {}):
        return jsonify({"error": "invalid profile"}), 400
    if not apply_cv_ai_suggestion(cv_data, perfil):
        return jsonify({"error": "no suggestion available"}), 400
    save_cv_data(cv_data)
    return jsonify({"ok": True, "perfil": perfil, "cv_data": cv_data})


@app.route("/api/admin/cv-ai/enrich-experiences", methods=["POST"])
@require_admin
def enrich_experiences_ai():
    body = request.get_json(silent=True) or {}
    perfil = body.get("perfil", "finops")
    cv_data = cv_data_source()
    if perfil not in (cv_data.get("perfis") or {}):
        return jsonify({"error": "invalid profile"}), 400
    site_data = content.get_block("site", {}) or {}
    experiences = filtered_experiences(cv_data, perfil)
    indexes = body.get("indexes")
    if isinstance(indexes, list):
        experiences = [exp for exp in experiences if cv_data.get("experiencias", []).index(exp) in indexes]
    errors = []
    for exp in experiences:
        try:
            exp.setdefault("enriquecimento_ia", {})[perfil] = generate_experience_summary(perfil, exp, site_data, cv_data)
        except RuntimeError as exc:
            errors.append({"cargo": exp.get("cargo"), "error": str(exc)})
    save_cv_data(cv_data)
    return jsonify({"ok": True, "perfil": perfil, "errors": errors, "cv_data": cv_data})


@app.route("/api/content/<block_id>")
def get_content(block_id):
    if block_id != "site" and not is_admin_request():
        return unauthorized()
    default = DEFAULT_CV_DATA if block_id == "cv_data" else None
    data = content.get_block(block_id, default)
    if data is None:
        return jsonify({"error": "not found"}), 404
    return jsonify(data)


@app.route("/api/content/<block_id>", methods=["PUT"])
@require_admin
def put_content(block_id):
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "invalid json"}), 400
    content.set_block(block_id, data)
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1", port=5000)
