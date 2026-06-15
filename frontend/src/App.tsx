import { useEffect, useState } from 'react'
import { ChevronDown, Award, Medal, Quote } from 'lucide-react'
import FinOpsContent from './components/finops/FinOpsContent'
import DevContent from './components/dev/DevContent'
import DadosContent from './components/dados/DadosContent'
import GenericProfileContent from './components/generic/GenericProfileContent'
import ThemeToggle from './components/ThemeToggle'
import Stars from './components/Stars'
import './App.css'
import savitarFoto from './assets/savitar.png'
import perfilFoto from './assets/profile.png'
import { apiFetch } from './lib/api'

interface Certificacao {
  nome: string
  desde: string
}

interface Perfil {
  titulo: string
  resumo: string
  skills: string[]
  experiencia?: string
  certificacoes?: Certificacao[]
}

interface Formacao {
  curso: string
  anos: string
}

interface PerfilData {
  nome: string
  idade: number
  formacoes: Formacao[]
  perfis: Record<string, Perfil>
  ordem?: string[]
}

const ORDEM_PADRAO = ['finops', 'dev', 'dados']

function App() {
  const [dados, setDados] = useState<PerfilData | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [ativo, setAtivo] = useState('sobre')
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null)

  useEffect(() => {
    apiFetch('/api/perfil')
      .then((res) => res.json())
      .then(setDados)
      .catch(() => setErro('Não foi possível carregar os dados.'))
  }, [])

  if (erro) return <main className="loading">{erro}</main>
  if (!dados) return <main className="loading">Carregando...</main>

  const perfilAtivo = dados.perfis[ativo]
  const ORDEM = (dados.ordem ?? ORDEM_PADRAO).filter((chave) => dados.perfis[chave])

  return (
    <div className="app">
      <Stars />
      <ThemeToggle />
      <div className="home-boxed">
        <header className="header">
          <img
            src={perfilFoto}
            alt="Geisa"
            className="header-foto"
            onClick={() => setFotoAmpliada(perfilFoto)}
          />
          <div className="prompt">
            <span className="prompt-symbol">$</span> whoami
          </div>
          <h1>{dados.nome}</h1>
          <p className="subtitle">
            {dados.idade} anos · Cientista da Computação · Adm ·{' '}
            <span className="cursor">_</span>
          </p>
        </header>

        <nav className="menu">
          <button
            className={ativo === 'sobre' ? 'menu-item ativo' : 'menu-item'}
            onClick={() => setAtivo('sobre')}
          >
            About me
          </button>
          {ORDEM.map((chave) => (
            <button
              key={chave}
              className={chave === ativo ? 'menu-item ativo' : 'menu-item'}
              onClick={() => setAtivo(chave)}
            >
              {dados.perfis[chave].titulo}
            </button>
          ))}
        </nav>

        {ativo === 'sobre' && (
          <section className="sobre card">
            <Quote size={28} className="quote-icon" strokeWidth={1.75} />
            <div>
              <p className="resumo italic">
                Gosto de aprender sobre assuntos diferentes e de me perder em pesquisas sobre
                temas aleatórios que despertam meu interesse. Costumo explorar um assunto até
                sentir que não há mais nada para descobrir sobre ele, o que me levou a acumular
                uma coleção bastante diversa de conhecimentos aleatórios (muitos deles
                completamente inúteis, mas estranhamente satisfatórios).
              </p>
              <p className="resumo italic">
                Grande parte do meu tempo livre acaba sendo dividida entre descobrir algo novo,
                assistir séries/podcasts e cuidar das minhas plantas. Tenho um interesse especial
                por ficção científica e fantasia, principalmente histórias que exploram
                possibilidades diferentes para o futuro da ciência e tecnologia.
              </p>
              <p className="resumo italic">
                Também gosto dos momentos simples: um café tranquilo, uma conversa interessante,
                uma caminhada pela orla ou apenas ficar em casa existindo com meu gato, e por
                falar nele...
              </p>
            </div>
          </section>
        )}

        {ativo === 'sobre' && (
          <div className="scroll-hint flex flex-col items-center gap-1 text-sm text-emerald-300">
            <span>Olha ele...!</span>
            <ChevronDown size={20} />
          </div>
        )}

        {ativo === 'sobre' && (
          <section className="sobre card">
            <h2>Aqui trabalhamos em equipe!</h2>
            <div className="savitar">
              <img
                src={savitarFoto}
                alt="Savitar"
                className="savitar-foto"
                onClick={() => setFotoAmpliada(savitarFoto)}
              />
              <p className="resumo italic">
                O Savitar acredita que produtividade e conforto não são conceitos opostos. Sua
                principal contribuição é lembrar que pausas são importantes. Entre suas
                responsabilidades estão supervisionar reuniões, ocupar espaços estratégicos do
                teclado e garantir que eu não trabalhe desacompanhada. Até o momento, sua melhor
                entrega continua sendo companhia de qualidade.
              </p>
            </div>
          </section>
        )}

        {(ativo === 'finops' || ativo === 'dev' || ativo === 'dados') && (
        <section className="perfil card">
          <h2>{perfilAtivo.titulo}</h2>
          <p className="resumo">{perfilAtivo.resumo}</p>

          {perfilAtivo.experiencia && (
            <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
              <Award size={18} strokeWidth={1.75} />
              {perfilAtivo.experiencia} de experiência{' '}
              {ativo === 'dev'
                ? 'com desenvolvimento de soluções'
                : ativo === 'dados'
                  ? 'com ciência de dados'
                  : 'com FinOps'}
            </div>
          )}

          {perfilAtivo.certificacoes && perfilAtivo.certificacoes.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Certificações</p>
              <ul className="mx-auto mt-3 grid max-w-xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
                {perfilAtivo.certificacoes.map((cert) => (
                  <li
                    key={cert.nome}
                    className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                  >
                    <Medal size={18} className="mt-0.5 shrink-0 text-emerald-400" strokeWidth={1.75} />
                    <span>
                      {cert.nome}
                      <br />
                      <span className="text-slate-500">desde {cert.desde}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        )}

        {ativo !== 'sobre' && (
          <div className="scroll-hint flex flex-col items-center gap-1 text-sm text-emerald-300">
            <span>Conheça o portfólio completo</span>
            <ChevronDown size={20} />
          </div>
        )}

        {ativo === 'sobre' && (
          <footer className="footer">
            <span>built with Flask + React + Vite</span>
          </footer>
        )}
      </div>

      {ativo === 'finops' && <FinOpsContent />}
      {ativo === 'dev' && <DevContent />}
      {ativo === 'dados' && <DadosContent />}
      {ativo !== 'sobre' && ativo !== 'finops' && ativo !== 'dev' && ativo !== 'dados' && (
        <GenericProfileContent profileKey={ativo} />
      )}

      {fotoAmpliada && (
        <div className="foto-modal" onClick={() => setFotoAmpliada(null)}>
          <img src={fotoAmpliada} alt="" className="foto-modal-img" />
        </div>
      )}
    </div>
  )
}

export default App
