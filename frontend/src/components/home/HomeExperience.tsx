import { useState } from 'react'
import { Award, ChevronDown, Medal, Quote } from 'lucide-react'
import FinOpsContent from '../finops/FinOpsContent'
import DevContent from '../dev/DevContent'
import DadosContent from '../dados/DadosContent'
import GenericProfileContent from '../generic/GenericProfileContent'
import ThemeToggle from '../ThemeToggle'
import Stars from '../Stars'
import { Editable } from '../admin/Editable'
import { useSiteData } from '../../hooks/useSiteData'
import savitarFoto from '../../assets/savitar.png'
import perfilFoto from '../../assets/profile.png'

export interface Certificacao {
  nome: string
  desde: string
}

export interface Perfil {
  titulo: string
  resumo: string
  skills: string[]
  experiencia?: string
  certificacoes?: Certificacao[]
  hidden?: boolean
}

export interface PerfilData {
  nome: string
  idade: number
  perfis: Record<string, Perfil>
  ordem?: string[]
}

type Props = {
  dados: PerfilData
  ativo: string
  onAtivoChange: (key: string) => void
}

const ORDEM_PADRAO = ['finops', 'dev', 'dados']

const ABOUT_DEFAULTS = {
  introParagraphs: [
    'Gosto de aprender sobre assuntos diferentes e de me perder em pesquisas sobre temas aleatórios que despertam meu interesse. Costumo explorar um assunto até sentir que não há mais nada para descobrir sobre ele, o que me levou a acumular uma coleção bastante diversa de conhecimentos aleatórios (muitos deles completamente inúteis, mas estranhamente satisfatórios).',
    'Grande parte do meu tempo livre acaba sendo dividida entre descobrir algo novo, assistir séries/podcasts e cuidar das minhas plantas. Tenho um interesse especial por ficção científica e fantasia, principalmente histórias que exploram possibilidades diferentes para o futuro da ciência e tecnologia.',
    'Também gosto dos momentos simples: um café tranquilo, uma conversa interessante, uma caminhada pela orla ou apenas ficar em casa existindo com meu gato, e por falar nele...',
  ],
  teamTitle: 'Aqui trabalhamos em equipe!',
  teamText:
    'O Savitar acredita que produtividade e conforto não são conceitos opostos. Sua principal contribuição é lembrar que pausas são importantes. Entre suas responsabilidades estão supervisionar reuniões, ocupar espaços estratégicos do teclado e garantir que eu não trabalhe desacompanhada. Até o momento, sua melhor entrega continua sendo companhia de qualidade.',
}

export default function HomeExperience({ dados, ativo, onAtivoChange }: Props) {
  const site = useSiteData<any>()
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null)
  const about = { ...ABOUT_DEFAULTS, ...(site?.about || {}) }
  const perfilAtivo = dados.perfis[ativo]
  const ordem = (dados.ordem ?? ORDEM_PADRAO).filter(
    (chave) => dados.perfis[chave] && !dados.perfis[chave].hidden,
  )

  return (
    <div className="app">
      <Stars />
      <ThemeToggle />
      <div className="home-boxed">
        <header className="header">
          <img
            src={perfilFoto}
            alt={dados.nome}
            className="header-foto"
            onClick={() => setFotoAmpliada(perfilFoto)}
          />
          <div className="prompt">
            <span className="prompt-symbol">$</span> whoami
          </div>
          <h1>{dados.nome}</h1>
          <p className="subtitle">
            {dados.idade} anos · Cientista da Computação · Adm · <span className="cursor">_</span>
          </p>
        </header>

        <nav className="menu">
          <button
            className={ativo === 'sobre' ? 'menu-item ativo' : 'menu-item'}
            onClick={() => onAtivoChange('sobre')}
          >
            About me
          </button>
          {ordem.map((chave) => (
            <button
              key={chave}
              className={chave === ativo ? 'menu-item ativo' : 'menu-item'}
              onClick={() => onAtivoChange(chave)}
            >
              {dados.perfis[chave].titulo}
            </button>
          ))}
        </nav>

        {ativo === 'sobre' && (
          <section className="sobre card">
            <Quote size={28} className="quote-icon" strokeWidth={1.75} />
            <Editable
              path={['about', 'introParagraphs']}
              value={about.introParagraphs}
              label="Apresentação"
            >
              <div>
                {about.introParagraphs.map((paragraph: string, index: number) => (
                  <p key={index} className="resumo italic">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Editable>
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
            <Editable path={['about', 'teamTitle']} value={about.teamTitle} label="Título">
              <h2>{about.teamTitle}</h2>
            </Editable>
            <div className="savitar">
              <img
                src={savitarFoto}
                alt="Savitar"
                className="savitar-foto"
                onClick={() => setFotoAmpliada(savitarFoto)}
              />
              <Editable path={['about', 'teamText']} value={about.teamText} label="Texto">
                <p className="resumo italic">{about.teamText}</p>
              </Editable>
            </div>
          </section>
        )}

        {perfilAtivo && ativo !== 'sobre' && (
          <section className="perfil card">
            <Editable
              path={['perfis', ativo, 'titulo']}
              value={perfilAtivo.titulo}
              label="Título do perfil"
            >
              <h2>{perfilAtivo.titulo}</h2>
            </Editable>
            <Editable
              path={['perfis', ativo, 'resumo']}
              value={perfilAtivo.resumo}
              label="Resumo do perfil"
            >
              <p className="resumo">{perfilAtivo.resumo}</p>
            </Editable>

            {perfilAtivo.experiencia && (
              <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
                <Award size={18} strokeWidth={1.75} />
                {perfilAtivo.experiencia} de experiência{' '}
                {ativo === 'dev'
                  ? 'com desenvolvimento de soluções'
                  : ativo === 'dados'
                    ? 'com ciência de dados'
                    : ativo === 'finops'
                      ? 'com FinOps'
                      : ''}
              </div>
            )}

            {perfilAtivo.certificacoes && perfilAtivo.certificacoes.length > 0 && (
              <Editable
                path={['perfis', ativo, 'certificacoes']}
                value={perfilAtivo.certificacoes}
                label="Certificações"
              >
                <div className="mt-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Certificações
                  </p>
                  <ul className="mx-auto mt-3 grid max-w-xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
                    {perfilAtivo.certificacoes.map((cert) => (
                      <li
                        key={`${cert.nome}-${cert.desde}`}
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
              </Editable>
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
