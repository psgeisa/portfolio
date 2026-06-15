import { Quote } from 'lucide-react'
import { heroTags } from '../../data/finopsData'
import { useSiteData } from '../../hooks/useSiteData'
import { Editable, AddItemButton } from '../admin/Editable'
import profilePhoto from '../../assets/profile.png'

const DEFAULT_HERO = {
  eyebrow: 'Cloud Governance & FinOps Engineer',
  title: 'FinOps & Cloud Governance',
  subtitle: 'Transparência financeira, autonomia dos times e tomada de decisão orientada a dados.',
  quote:
    'Transformo dados brutos de consumo cloud em inteligência financeira, governança e produtos escaláveis para negócio e tecnologia.',
}

export default function HeroSection() {
  const site = useSiteData()
  const hero = { ...DEFAULT_HERO, ...(site?.finops?.hero ?? {}) }
  const tags: string[] = site?.finops?.heroTags ?? heroTags.map((t) => t.label)

  return (
    <section className="relative overflow-hidden border-b border-white/5 px-6 py-24 sm:px-10 lg:px-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(52,211,153,0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(96,165,250,0.12), transparent 40%)',
        }}
      />
      <div className="mx-auto max-w-4xl text-center">
        <img
          src={profilePhoto}
          alt="Geisa dos Reis"
          className="mx-auto mb-6 h-28 w-28 rounded-full border-2 border-emerald-400/40 object-cover shadow-lg shadow-emerald-500/10 sm:h-32 sm:w-32"
        />
        <Editable path={['finops', 'hero', 'eyebrow']} label="Subtítulo curto">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">{hero.eyebrow}</p>
        </Editable>
        <Editable path={['finops', 'hero', 'title']} label="Título">
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
        </Editable>
        <Editable path={['finops', 'hero', 'subtitle']} label="Subtítulo">
          <p className="mt-6 text-lg text-slate-300 sm:text-xl">{hero.subtitle}</p>
        </Editable>
        <Editable path={['finops', 'hero', 'quote']} label="Citação">
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
            <Quote className="mb-2 text-emerald-400/70" size={22} strokeWidth={1.75} />
            <p className="text-base italic text-slate-300 sm:text-lg">{hero.quote}</p>
          </div>
        </Editable>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {tags.map((tag, index) => (
            <Editable key={tag} path={['finops', 'heroTags', index]} removable label="Tag">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-200 transition-colors hover:border-emerald-400/40 hover:text-emerald-300">
                {tag}
              </span>
            </Editable>
          ))}
          <AddItemButton path={['finops', 'heroTags']} label="+ Tag" template="Nova tag" />
        </div>
      </div>
    </section>
  )
}
