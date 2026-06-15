"""One-off script to populate the `content_blocks` table in Supabase with the
current hardcoded site content (the "site" block) and an empty "perfis"
override map. Run once: `python seed_content.py`.
"""

from dotenv import load_dotenv

load_dotenv()

import content
from cv_data import DEFAULT_CV_DATA

SITE = {
    "ordem": ["finops", "dev", "dados"],

    "perfis": {},

    "finops": {
        "heroTags": ["FinOps", "Cloud Governance", "Forecast", "Self-Service Analytics", "Azure", "Databricks", "Python", "SQL"],
        "pillars": [
            {
                "title": "Transparência Financeira",
                "icon": "Eye",
                "items": ["Alocação de custos", "Visibilidade por time", "Accountability"],
                "details": {
                    "paragraphs": [
                        "Estruturei mecanismos de governança e rastreabilidade financeira em cloud, criando padrões de tagueamento, políticas automatizadas e uma arquitetura de accountability financeira para garantir que os recursos fossem provisionados já com os metadados necessários para identificação de time, produto, ambiente e centro de custo.",
                        "Essas informações passaram a alimentar os modelos de alocação e distribuição de custos, permitindo análises mais granulares, mecanismos de atribuição e fallback para recursos sem tags, além de maior transparência sobre quem consome recursos e onde os investimentos estão sendo realizados.",
                    ],
                    "tags": ["JSON", "Azure Policy", "Tagging", "Billing & Usage", "Cost Allocation"],
                },
            },
            {
                "title": "Inteligência Executiva",
                "icon": "BrainCircuit",
                "items": ["Reports automatizados", "Diagnóstico de variações", "Forecast de custos"],
                "details": {
                    "paragraphs": [
                        "Desenvolvi reports executivos automatizados distribuídos periodicamente para a diretoria e presidência, consolidando informações financeiras relacionadas ao consumo cloud. A solução combina análises descritivas, diagnósticos de variações e forecast de custos, transformando dados técnicos de billing em informações estratégicas para acompanhamento financeiro e tomada de decisão.",
                        "E para devs e líderes de projetos, desenvolvi dashboards operacionais em Databricks para acompanhamento diário dos custos cloud pelas equipes técnicas. As análises permitem visualizar o consumo com granularidade por recurso, workload, job, usuário, ambiente e centro de custo, apoiando investigações, identificação de desperdícios e oportunidades de otimização.",
                    ],
                    "tags": ["Python", "Databricks", "Forecast", "Cost Analytics", "Executive Reporting"],
                },
            },
            {
                "title": "Self-Service Analytics",
                "icon": "MessageSquareCode",
                "items": ["Databricks Genie", "Consulta NLP", "Gráficos por autonomia dos times"],
                "details": {
                    "paragraphs": [
                        "Implementei uma solução de Self-Service Analytics baseada em Databricks Genie, transformando consultas financeiras em análises de autoatendimento realizadas pelos próprios times através de linguagem natural.",
                        "A plataforma utiliza views segmentadas por time e possibilita a exploração autônoma dos custos cloud, incluindo geração de gráficos e análises sob demanda, reduzindo a dependência da persona de FinOps para consultas recorrentes.",
                    ],
                    "tags": ["Databricks Genie", "SQL", "Views", "Cost Visibility", "Natural Language Query"],
                },
            },
            {
                "title": "Governança Cloud",
                "icon": "ShieldCheck",
                "items": ["Azure Governance", "RBAC", "Policies", "Azure Monitor"],
                "details": {
                    "paragraphs": [
                        "Desenhei e implementei a arquitetura de governança cloud da organização, criando padrões organizacionais para ambientes Azure, Databricks e Azure DevOps.",
                        "A solução combinou estruturas por time, controles de acesso baseados em RBAC, Azure Policies e padrões de provisionamento, garantindo escalabilidade, segurança, governança operacional e alinhamento com os processos de FinOps.",
                    ],
                    "tags": ["Azure Governance", "RBAC", "Azure Policies", "Cloud Architecture", "Environment Management"],
                },
            },
        ],
        "products": [
            {
                "name": "FinOps Self-Service Analytics",
                "challenge": "As análises de custos cloud dependiam de solicitações manuais para a equipe responsável, reduzindo a autonomia dos times e aumentando o tempo de resposta para dúvidas recorrentes.",
                "solution": "Criação de um chatbot com Databricks Genie conectado às views de custos de cada time, permitindo que gestores e áreas consumidoras consultem seus próprios custos, façam perguntas em linguagem natural e gerem gráficos de forma autônoma.",
                "benefits": ["Democratização do acesso aos dados financeiros", "Redução da dependência da equipe de FinOps", "Maior autonomia dos times", "Aceleração da investigação de desvios", "Expansão da cultura FinOps"],
                "technologies": ["Databricks Genie", "SQL", "Views", "Azure", "Governança de Dados"],
                "impact": "Autonomia e cultura FinOps",
            },
            {
                "name": "Executive FinOps Intelligence",
                "challenge": "Diretoria e presidência precisavam acompanhar a evolução dos custos cloud, entender variações relevantes e antecipar tendências de consumo sem depender de análises manuais sob demanda.",
                "solution": "Desenvolvi uma solução de comunicação executiva para FinOps, automatizando reports (Python/HTML), conectados a análises descritivas, diagnósticas e forecast de custos.",
                "benefits": ["Visibilidade recorrente para liderança", "Diagnóstico de variações financeiras", "Antecipação de tendências de consumo", "Redução de esforço manual em análises executivas", "Apoio à tomada de decisão estratégica"],
                "technologies": ["Executive FinOps Intelligence", "Cost Forecasting", "Variance Analysis", "Python Automation"],
                "impact": "Inteligência executiva",
            },
            {
                "name": "Cloud Cost Allocation & Accountability",
                "challenge": "Custos cloud concentrados ou pouco detalhados dificultavam a compreensão de consumo por time, projeto ou centro de custo.",
                "solution": "Estruturação de mecanismos de alocação, rateio, tagueamento e associação dos custos aos respectivos times consumidores, aumentando a rastreabilidade e a responsabilidade financeira.",
                "benefits": ["Maior clareza sobre quem consome recursos", "Melhoria na qualidade das análises de variação", "Suporte a decisões de orçamento", "Fortalecimento da accountability", "Base para cultura FinOps mais madura"],
                "technologies": ["Azure Billing", "Tags", "Azure Allocation", "Azure Policy"],
                "impact": "Transparência e accountability",
            },
            {
                "name": "Cost Anomaly Detection",
                "challenge": "Aumentos inesperados de custos podiam passar despercebidos até o fechamento ou análise manual posterior.",
                "solution": "Criação de monitoramentos e alertas para identificar variações anormais de consumo, desvios financeiros e comportamentos fora do padrão.",
                "benefits": ["Identificação mais rápida de desvios", "Redução do risco de surpresa financeira", "Apoio à investigação de causas", "Maior controle sobre consumo cloud", "Evolução da observabilidade financeira"],
                "technologies": ["Anomaly Detection", "Financial Observability", "Cost Monitoring", "Operational Analytics"],
                "impact": "Observabilidade financeira",
            },
            {
                "name": "Cloud Operations Intelligence",
                "challenge": "Eventos operacionais como clusters fora de horário, execuções longas e falhas impactavam custos, performance e eficiência operacional.",
                "solution": "Criação de monitoramentos para conectar eventos operacionais ao impacto financeiro, permitindo identificar desperdícios, falhas e oportunidades de otimização.",
                "benefits": ["Maior eficiência operacional", "Redução de desperdícios", "Identificação de recursos ociosos", "Melhor conexão entre operação e custo", "Apoio a decisões de otimização"],
                "technologies": ["Cost Optimization", "Azure Monitor", "Cloud Observability", "Operational Analytics"],
                "impact": "Eficiência operacional",
            },
        ],
        "journeySteps": [
            {"title": "Visibilidade", "description": "Organização dos dados de billing e consumo", "icon": "Eye"},
            {"title": "Alocação", "description": "Associação de custos a times, projetos e centros de custo", "icon": "Layers"},
            {"title": "Análise", "description": "Dashboards, relatórios, diagnóstico e forecast", "icon": "LineChart"},
            {"title": "Automação", "description": "Reports executivos, alertas e monitoramentos", "icon": "Workflow"},
            {"title": "Autonomia", "description": "Self-service analytics com linguagem natural", "icon": "MessageSquareCode"},
            {"title": "Governança", "description": "Políticas, RBAC, rastreabilidade e melhoria contínua", "icon": "ShieldCheck"},
        ],
        "techGroups": [
            {"title": "Dados & Analytics", "icon": "Database", "items": ["SQL Server", "Data Warehouse", "Databricks Catalog", "Azure Blob Storage", "Integração de Dados", "Governança de Dados"]},
            {"title": "Cloud & Governança", "icon": "Compass", "items": ["Azure Billing", "Azure Monitor", "Azure Logs", "RBAC", "Custom-role", "Azure Policies", "KQL", "JSON"]},
            {"title": "FinOps", "icon": "FileSpreadsheet", "items": ["Cost Allocation", "Billing & Usage", "Forecast", "Budget Tracking", "Anomaly Detection", "Chargeback / Showback"]},
            {"title": "Produto & Automação", "icon": "Workflow", "items": ["Reportings", "Logic Apps", "Monitorings", "Dashboards", "Databricks Genie"]},
        ],
    },

    "dev": {
        "devTags": ["React", "Tailwind CSS", "Vite", "Flask", "Python", "SQL", "Git", "Vercel"],
        "devIntro": "Ao longo dos últimos anos participei da criação de soluções para diferentes áreas da empresa. Minha atuação normalmente envolve entender o problema, desenhar a solução, estruturar os dados e transformar a ideia em uma aplicação funcional.",
        "devTimeline": [
            {"ano": "2020–2022", "texto": "Desenvolvimento de aplicações internas em Power Platform para digitalizar processos, validar ideias rapidamente e entregar soluções com baixo tempo de implementação e adoção."},
            {"ano": "2023", "texto": "Estruturação da governança em Azure, consolidando serviços, acessos, e padrões para crescimento sustentável das soluções de processos de automação e aplicações transacionais."},
            {"ano": "2024", "texto": "Implementação de integrações entre Azure e Microsoft 365, conectando aplicações, identidades, API Permissions, MS Graph e base de dados para automações e serviços utilizados pelas áreas de negócio."},
            {"ano": "2025", "texto": "Migração da primeira aplicação crítica para arquitetura web moderna, preservando regras de negócio, processos existentes, integrações e experiência dos usuários."},
            {"ano": "2026", "texto": "Apoio à modernização do portfólio de aplicações internas, conduzindo a evolução gradual de soluções low-code para arquiteturas escaláveis baseadas em desenvolvimento Full Stack."},
        ],
        "devSections": [
            {
                "title": "Desenvolvimento de Aplicações Corporativas",
                "icon": "ClipboardList",
                "blocks": [
                    {
                        "heading": "Levantamento e análise de requisitos",
                        "columns": 3,
                        "items": ["Identificação e definição do problema", "Requisitos funcionais", "Requisitos não funcionais", "Mapeamento de stakeholders", "Modelagem de processos", "Documentação técnica e funcional", "Elaboração de diagramas UML", "Definição de fluxos de sistema", "Definição de fluxos de navegação", "Experiência do usuário"],
                    },
                    {
                        "heading": "Aplicações desenvolvidas",
                        "carousel": True,
                        "apps": [
                            {
                                "name": "Sistema de Controle de Férias",
                                "items": ["Gestão do planejamento de férias dos colaboradores", "Fluxo de aprovação", "Integração com base corporativa de colaboradores", "Controle de períodos aquisitivos"],
                                "back": {
                                    "problema": "O planejamento de férias era descentralizado e sujeito a erros operacionais, dificultando o controle dos períodos aquisitivos e o acompanhamento das aprovações.",
                                    "beneficios": ["Centralização do planejamento de férias", "Controle automatizado de períodos aquisitivos", "Fluxo estruturado de aprovações", "Integração com a base corporativa de colaboradores"],
                                },
                            },
                            {
                                "name": "Sistema de Gestão de Currículos",
                                "items": ["Integração com site institucional", "Integração com Microsoft Forms", "Automação do processo de recrutamento", "Estruturação dos dados para eliminar análise manual de documentos", "Transformação dos currículos em registros estruturados para o RH"],
                                "back": {
                                    "problema": "O processo de recrutamento dependia da análise manual de currículos e informações dispersas, reduzindo a eficiência e a padronização das avaliações.",
                                    "beneficios": ["Automatização da triagem de candidatos", "Integração entre formulários e site institucional", "Transformação de documentos em dados estruturados", "Redução do esforço operacional do RH"],
                                },
                            },
                            {
                                "name": "Sistema de Reserva de Mesas",
                                "items": ["Controle de ocupação de mesas", "Regras de alocação fixa por equipe", "Regras diferenciadas por semana", "Gestão da capacidade dos ambientes"],
                                "back": {
                                    "problema": "A utilização dos espaços compartilhados exigia controles manuais, dificultando a gestão da capacidade dos ambientes e a aplicação das regras de ocupação.",
                                    "beneficios": ["Controle centralizado das reservas", "Melhor utilização dos espaços físicos", "Aplicação automática das regras de alocação", "Visibilidade da ocupação dos ambientes"],
                                },
                            },
                            {
                                "name": "Sistema de Gestão de Pessoas",
                                "items": ["Aplicação centralizadora de dados cadastrais", "Integração com múltiplos sistemas internos", "Base única de colaboradores utilizada por outros aplicativos corporativos"],
                                "back": {
                                    "problema": "Informações cadastrais de colaboradores estavam distribuídas em diferentes sistemas, gerando inconsistências e dificultando o consumo dos dados por aplicações corporativas.",
                                    "beneficios": ["Criação de uma fonte única de dados de pessoas", "Integração entre sistemas corporativos", "Padronização das informações cadastrais", "Reutilização dos dados por múltiplas aplicações"],
                                },
                            },
                            {
                                "name": "Portal de Pessoas",
                                "items": ["Diretório corporativo integrado", "Visualização hierárquica por áreas e equipes", "Perfis com biografia e histórico organizacional", "Comunicação direta via Teams, telefone e e-mail"],
                                "back": {
                                    "problema": "Encontrar informações sobre colaboradores, entender a estrutura organizacional e localizar os canais corretos de contato exigia consultas em múltiplos sistemas e fontes distintas.",
                                    "beneficios": ["Centralização das informações dos colaboradores", "Visualização da estrutura organizacional e equipes", "Facilidade para localizar especialistas e responsáveis", "Integração direta com Teams, e-mail e telefonia"],
                                },
                            },
                        ],
                    },
                ],
            },
            {
                "title": "Arquitetura e Plataforma Low Code",
                "icon": "Layers",
                "note": "Além do desenvolvimento dos aplicativos, atuação na estruturação do ecossistema.",
                "blocks": [
                    {
                        "heading": "Atividades",
                        "items": ["Definição de padrões de desenvolvimento", "Apoio técnico para novos desenvolvedores Low Code", "Governança das aplicações", "Integração de plataformas corporativas", "Disseminação de boas práticas"],
                    },
                ],
            },
            {
                "title": "Integração de Dados e Cloud",
                "icon": "Database",
                "blocks": [
                    {
                        "heading": "Databricks",
                        "items": ["Estruturação da conectividade entre Power Platform e Databricks", "Disponibilização conectividade para aplicações internas", "Apoio na consolidação da estratégia de dados em nuvem"],
                    },
                    {
                        "heading": "Azure",
                        "items": ["Participação na consolidação do ambiente cloud corporativo", "Migração de processos internos para arquitetura cloud", "Adequação de aplicações às novas diretrizes tecnológicas"],
                    },
                ],
            },
            {
                "title": "Modernização de Sistemas",
                "icon": "RefreshCw",
                "blocks": [
                    {
                        "heading": "Aplicações",
                        "apps": [
                            {
                                "name": "Migração da Régua de Risco de Crédito",
                                "items": ["Conversão de processo originalmente executado em plataforma Low Code", "Redesenho da solução para arquitetura web", "Revisão das regras de negócio", "Modernização tecnológica da aplicação"],
                            },
                            {
                                "name": "Migração do Sistema de Gestão de Pessoas",
                                "items": ["Apoio consultivo na migração do aplicativo para Flask, React e Vite", "Orientação sobre estruturação da base de dados", "Definição da conectividade com warehouse Databricks e SQL Serverless"],
                            },
                        ],
                    },
                ],
            },
            {
                "title": "Desenvolvimento Web Full Stack",
                "icon": "Code2",
                "note": "Posteriormente, desenvolvimento de aplicações utilizando frameworks tradicionais.",
                "blocks": [
                    {
                        "heading": "Aplicações desenvolvidas",
                        "carousel": True,
                        "apps": [
                            {
                                "name": "Aplicação de Análise de NDAs",
                                "groups": [
                                    {"heading": "Funcionalidades", "items": ["Upload e processamento de docs", "Análise assistida por IA", "Extração e sumarização de informações", "Reescrita de textos problemáticos", "Entrega de editável para validação", "Apoio à avaliação contratual"]},
                                    {"heading": "Ferramentas", "items": ["Python", "Flask", "React", "LLM", "Generative AI", "TrackChanges O365"]},
                                ],
                                "back": {
                                    "problema": "Analisar contratos de confidencialidade manualmente consumia tempo dos times, gerava inconsistências entre avaliações e dificultava a identificação rápida de cláusulas que exigiam atenção jurídica ou operacional.",
                                    "beneficios": ["Redução do tempo de análise contratual", "Padronização das avaliações realizadas", "Identificação assistida de cláusulas críticas", "Geração de documentos revisáveis para validação humana"],
                                },
                            },
                            {
                                "name": "Sistema de Fluxo de Aprovações",
                                "groups": [
                                    {"heading": "Funcionalidades", "items": ["Workflow dinâmico de aprovação", "Regras parametrizáveis", "Gestão de stakeholders", "Controle de status/votos e histórico", "Prompts selecionáveis para resumos padronizados", "Faq-LLM atrelado a base interna"]},
                                    {"heading": "Ferramentas", "items": ["Python/SQL Server", "Git/Azure DevOps", "Flask/React/Vite", "Logic Apps", "Wharehouse", "LLM"]},
                                ],
                                "back": {
                                    "problema": "Os processos de aprovação dependiam de controles descentralizados, dificultando o acompanhamento das decisões, a aplicação consistente das regras e a rastreabilidade das aprovações.",
                                    "beneficios": ["Centralização dos fluxos de aprovação", "Rastreabilidade completa das decisões", "Automação de regras e encaminhamentos", "Padronização da geração de resumos executivos"],
                                },
                            },
                            {
                                "name": "Metas Flow",
                                "groups": [
                                    {"heading": "Funcionalidades", "items": ["Registro de Metas e Avaliações PDI", "Fluxo de aprovações de metas/notas", "Simulações de distribuição de resultados", "Auditoria e rastreabilidade do processo", "Cálculo de remuneração variável"]},
                                    {"heading": "Tecnologias", "items": ["Python/SQL Server", "Git/Azure DevOps", "Flask/React/Vite", "Logic Apps", "RBACs"]},
                                ],
                                "back": {
                                    "problema": "Cada área possuía critérios próprios para avaliação de desempenho e distribuição de resultados, tornando o processo difícil de consolidar, auditar e administrar em uma única plataforma.",
                                    "beneficios": ["Centralização da gestão de metas e avaliações", "Flexibilidade para diferentes regras por área", "Automatização dos cálculos de remuneração variável", "Transparência e auditabilidade do processo"],
                                },
                            },
                        ],
                    },
                ],
            },
        ],
        "devTechGroups": [
            {"title": "Front-end", "icon": "Code2", "items": ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Vite"]},
            {"title": "Back-end", "icon": "Server", "items": ["Python", "Flask", "APIs REST", "Integração de Sistemas", "Autenticação", "RBAC"]},
            {"title": "Dados & Analytics", "icon": "Database", "items": ["SQL Server", "Data Warehouse", "Databricks Catalog", "Azure Blob Storage", "Integração de Dados", "Governança de Dados"]},
            {"title": "IA Aplicada", "icon": "BrainCircuit", "items": ["LLM Integration", "Prompt Engineering", "RAG", "Document Processing", "Speech-to-Text", "Foundry Models/Tools"]},
            {"title": "DevOps & Versionamento", "icon": "GitBranch", "items": ["Git", "Azure DevOps", "Branching Strategy", "Pull Requests", "CI/CD", "Release Management"]},
            {"title": "Product & Project Management", "icon": "Compass", "items": ["Agile", "CRISP-DM", "Microsoft Planner", "Gestão de Stakeholders", "Levantamento de Requisitos", "Planejamento de Projetos"]},
        ],
        "devSummary": {
            "paragraph": 'Não se trata de uma "desenvolvedora Power Platform". A trajetória é a de uma profissional com experiência em análise de sistemas, desenvolvimento de aplicações corporativas e modernização de processos, atuando desde a definição de requisitos e modelagem de soluções até a implementação de aplicações Low Code e Full Stack em ambientes cloud. Experiência na construção de sistemas de RH, gestão de pessoas, reservas, workflows de aprovação, análise documental e integração de dados corporativos utilizando Power Platform, React, Flask, Python, Databricks e Azure.',
            "quote": "Não apenas desenvolvi telas; desenhei e implementei soluções completas de negócio.",
        },
    },

    "dados": {
        "dadosTags": ["Data Products", "Decision Intelligence", "Analytics Engineering", "Generative AI", "Business Intelligence", "Data Science", "Databricks", "Python", "SQL", "Power BI", "NLP", "Machine Learning"],
        "dadosIntro": "Acredito que dados geram valor quando deixam de ser apenas informação e passam a orientar decisões. Meu trabalho consiste em transformar dados, análises e inteligência artificial em produtos utilizáveis pelo negócio, conectando tecnologia, contexto e experiência do usuário para tornar informações complexas mais acessíveis, acionáveis e escaláveis.",
        "dadosFilosofia": [
            "Acredito que dados geram valor quando deixam de ser apenas informação e passam a orientar decisões. Meu trabalho consiste em transformar dados, análises e inteligência artificial em produtos utilizáveis pelo negócio, conectando tecnologia, contexto e experiência do usuário para tornar informações complexas mais acessíveis, acionáveis e escaláveis.",
            "Atuo desde a estruturação de bases e modelos analíticos até a construção de aplicações, automações e soluções de IA que aproximam pessoas dos dados. Mais do que produzir análises, busco criar mecanismos que ampliem a autonomia dos usuários e acelerem a tomada de decisão.",
        ],
        "dadosSummary": {
            "name": "Generative AI & NLP",
            "challenge": "Processos corporativos frequentemente dependem da análise de grandes volumes de documentos, informações dispersas e solicitações recorrentes, exigindo esforço manual para consolidar conhecimento, interpretar conteúdo e produzir informações úteis para tomada de decisão.",
            "solution": "Desenvolvimento de soluções baseadas em IA Generativa e Processamento de Linguagem Natural para transformar documentos, bases corporativas e informações não estruturadas em conhecimento acessível e acionável. As aplicações incluem assistentes inteligentes, análise documental, geração automática de resumos, classificação de informações e apoio à tomada de decisão em processos financeiros, jurídicos e corporativos.",
            "benefits": ["Assistentes conversacionais conectados a dados corporativos", "Interpretação automatizada de documentos", "Extração estruturada de informações relevantes", "Geração automática de resumos executivos", "Apoio à análise de crédito e contratos", "Redução de atividades manuais e repetitivas", "Democratização do acesso ao conhecimento corporativo"],
            "useCases": ["Financial Intelligence Chatbot", "Credit Intelligence Assistant", "NDA Intelligence Platform", "Executive Summary Generator", "Notification Summarizer", "Lei do Bem Assistant", "Databricks Genie Solutions"],
            "technologies": ["Generative AI", "LLM", "NLP", "Document Intelligence", "Prompt Engineering", "OpenAI", "Python", "Databricks"],
            "impact": "Automação inteligente",
            "extraTag": "AI",
        },
        "dadosProjects": [
            {
                "name": "NDA Intelligence Platform",
                "challenge": "A análise de contratos de confidencialidade (NDAs) exigia avaliação manual de cláusulas, riscos e conformidade, consumindo tempo das equipes jurídicas e dificultando a padronização dos critérios utilizados na tomada de decisão.",
                "solution": "Desenvolvimento de uma plataforma de análise contratual que combina NLP, IA generativa e modelos analíticos para classificar cláusulas, calcular scores de risco, detectar padrões atípicos e apoiar decisões sobre aprovação de contratos. O sistema incorpora feedback humano para mensurar acurácia, monitorar KPIs e evoluir continuamente os mecanismos de análise.",
                "benefits": ["Redução do tempo de análise contratual", "Padronização da avaliação de riscos", "Identificação automática de cláusulas críticas e incomuns", "Maior consistência nas decisões de aprovação", "Monitoramento contínuo da qualidade das análises"],
                "technologies": ["NLP", "Classification", "Risk Scoring", "Anomaly Detection", "Human-in-the-Loop", "Model Monitoring"],
                "impact": "Automação inteligente",
            },
            {
                "name": "Forecast & Advanced Analytics",
                "challenge": "Antecipar custos cloud, consumo de recursos e tendências operacionais exigia análises recorrentes e consolidação manual de informações, dificultando o planejamento financeiro e a identificação antecipada de desvios.",
                "solution": "Desenvolvimento de mecanismos de forecast e análise avançada para projeção de custos e consumo de recursos, utilizando padrões históricos, segmentação temporal entre dias úteis e finais de semana, identificação de tendências e simulações de cenários para apoiar o planejamento financeiro e operacional.",
                "benefits": ["Forecast de custos cloud", "Projeção de consumo", "Simulações orçamentárias", "Identificação antecipada de desvios", "Apoio ao planejamento financeiro", "Maior previsibilidade operacional"],
                "technologies": ["Python", "Databricks", "Forecast Analytics", "Trend Analysis", "Scenario Simulation", "Deterministic Forecasting"],
                "impact": "Inteligência executiva",
                "extraTag": "Advanced Analytics",
            },
            {
                "name": "Lei do Bem Intelligence",
                "challenge": "O processo de enquadramento de iniciativas tecnológicas para atendimento aos requisitos da Lei do Bem exigia a consolidação de informações provenientes de diferentes sistemas corporativos, além da interpretação de evidências técnicas e elaboração de justificativas para avaliação especializada. O processo era intensivo em esforço manual e dependia da análise individual de cada projeto.",
                "solution": "Desenvolvimento de uma solução baseada em NLP e IA Generativa para consolidar informações corporativas, interpretar evidências técnicas e apoiar a classificação de iniciativas de tecnologia segundo critérios regulatórios. A solução realiza o cruzamento automatizado de dados, gera justificativas técnicas estruturadas e incorpora validação especializada para aumentar a consistência e rastreabilidade do processo.",
                "benefits": ["Consolidação automática de informações corporativas", "Classificação assistida de iniciativas tecnológicas", "Geração automática de justificativas técnicas", "Padronização das informações submetidas à avaliação", "Redução de esforço operacional", "Apoio à análise regulatória e tomada de decisão"],
                "technologies": ["NLP", "Generative AI", "LLM", "Python", "Databricks", "SQL", "Information Classification", "Decision Support"],
                "impact": "Automação inteligente",
            },
        ],
        "dadosTechGroups": [
            {"title": "Dados", "icon": "Database", "items": ["SQL", "Databricks", "Spark", "Data Warehouse", "Azure Storage", "Data Modeling"]},
            {"title": "Analytics", "icon": "LayoutGrid", "items": ["Power BI", "DAX", "Forecasting", "KPIs", "Executive Reporting", "Business Intelligence"]},
            {"title": "IA", "icon": "Sparkles", "items": ["LLM", "OpenAI", "Prompt Engineering", "NLP", "Document Intelligence", "Generative AI"]},
            {"title": "Desenvolvimento", "icon": "BrainCircuit", "items": ["Python", "TypeScript", "React", "Power Apps", "Power Automate", "REST APIs"]},
            {"title": "Cloud", "icon": "TrendingUp", "items": ["Azure", "Databricks", "Azure Monitor", "Azure DevOps", "RBAC", "Governança Cloud"]},
        ],
    },
}


if __name__ == "__main__":
    content.set_block("site", SITE)
    content.set_block("cv_data", DEFAULT_CV_DATA)
    print("Seeded 'site' content block.")
    print("Seeded 'cv_data' content block.")
