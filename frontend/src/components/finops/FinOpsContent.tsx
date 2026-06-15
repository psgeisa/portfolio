import { Quote, Eye } from 'lucide-react'
import HeroSection from './HeroSection'
import PillarCard from './PillarCard'
import ProductCarousel from './ProductCarousel'
import Timeline from './Timeline'
import TechStackSection from './TechStackSection'
import { pillars as staticPillars, products as staticProducts, type Pillar, type Product } from '../../data/finopsData'
import { useSiteData } from '../../hooks/useSiteData'
import { resolveIcon } from '../../lib/icons'
import { Editable, AddItemButton } from '../admin/Editable'
import BackToTopButton from '../common/BackToTopButton'

export default function FinOpsContent() {
  const site = useSiteData()
  const pillars: Pillar[] = (site?.finops?.pillars ?? staticPillars).map((pillar: any) => ({
    ...pillar,
    icon: typeof pillar.icon === 'string' ? resolveIcon(pillar.icon, Eye) : pillar.icon,
  }))
  const products: Product[] = site?.finops?.products ?? staticProducts
  const atuacao = {
    title: 'Atuação em FinOps',
    quote:
      'Minha atuação combina engenharia, dados, cloud e comunicação executiva para criar mecanismos que aumentam a transparência, reduzem esforço operacional e apoiam decisões conscientes sobre consumo tecnológico.',
    ...(site?.finops?.atuacao ?? {}),
  }
  const produtos = {
    title: 'Produtos FinOps',
    quote:
      'Meu foco é construir soluções que tornem a tecnologia mais transparente, os times mais autônomos e as decisões mais bem fundamentadas por dados.',
    ...(site?.finops?.produtos ?? {}),
  }
  const jornada = {
    title: 'Jornada FinOps',
    quote:
      'Para mim, FinOps não é uma coleção de iniciativas isoladas. É uma evolução contínua que conecta visibilidade, accountability, inteligência, otimização e governança.',
    ...(site?.finops?.jornada ?? {}),
  }
  const stackTitle: string = site?.finops?.stackTitle ?? 'Stack Técnica'
  const filosofia = {
    title: 'Filosofia de Trabalho',
    text:
      'Acredito que FinOps gera mais valor quando atua não apenas como uma disciplina de controle de custos, mas como um facilitador de decisões. Conecto governança, dados, engenharia e negócio para aumentar a transparência sobre o consumo de tecnologia e tornar os custos mais compreensíveis para diferentes públicos. Minha atuação abrange desde a estruturação de mecanismos de accountability financeira e governança cloud até o desenvolvimento de soluções de analytics, automação e inteligência executiva. Acredito que visibilidade, autonomia e contexto são fundamentais para que equipes técnicas, gestores e lideranças tomem decisões mais conscientes sobre investimentos em tecnologia. Por isso, transformo dados de consumo cloud em produtos, processos e insights que fortalecem a governança, ampliam a autonomia dos times e apoiam uma gestão financeira mais sustentável.',
    quote: 'FinOps, para mim, não é bloquear consumo. É criar clareza para que tecnologia e negócio tomem melhores decisões.',
    ...(site?.finops?.filosofia ?? {}),
  }

  return (
    <div className="w-full bg-[#0a0c10] font-sans text-slate-100">
      <HeroSection />

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <Editable path={['finops', 'atuacao', 'title']} label="Título da seção">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">{atuacao.title}</h2>
          </Editable>
          <Editable path={['finops', 'atuacao', 'quote']} label="Citação">
            <div className="mx-auto mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
              <Quote className="mb-2 text-emerald-400/70" size={22} strokeWidth={1.75} />
              <p className="italic text-slate-300">{atuacao.quote}</p>
            </div>
          </Editable>
        </div>
        <div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => (
            <Editable key={pillar.title} path={['finops', 'pillars', index]} removable label="Pilar">
              <PillarCard index={index} {...pillar} />
            </Editable>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <AddItemButton
            path={['finops', 'pillars']}
            label="+ Adicionar pilar"
            template={{ title: 'Novo pilar', icon: 'Eye', items: [] }}
          />
        </div>
      </section>

      <section className="border-t border-white/5 bg-white/[0.015] py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <Editable path={['finops', 'produtos', 'title']} label="Título da seção">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{produtos.title}</h2>
            </Editable>
            <Editable path={['finops', 'produtos', 'quote']} label="Citação">
              <div className="mx-auto mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
                <Quote className="mb-2 text-emerald-400/70" size={22} strokeWidth={1.75} />
                <p className="italic text-slate-300">{produtos.quote}</p>
              </div>
            </Editable>
          </div>
        </div>
        <div className="mt-12 px-6 sm:px-10 lg:px-16">
          <Editable path={['finops', 'products']} label="Produtos FinOps">
            <ProductCarousel products={products} />
          </Editable>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <Editable path={['finops', 'jornada', 'title']} label="Título da seção">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">{jornada.title}</h2>
          </Editable>
          <Editable path={['finops', 'jornada', 'quote']} label="Citação">
            <div className="mx-auto mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
              <Quote className="mb-2 text-emerald-400/70" size={22} strokeWidth={1.75} />
              <p className="italic text-slate-300">{jornada.quote}</p>
            </div>
          </Editable>
        </div>
        <div className="mt-12">
          <Timeline />
        </div>
      </section>

      <section className="border-t border-white/5 bg-white/[0.015] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <Editable path={['finops', 'stackTitle']} label="Título da seção">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{stackTitle}</h2>
            </Editable>
          </div>
          <div className="mt-12">
            <TechStackSection />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10 lg:px-16">
        <Editable path={['finops', 'filosofia', 'title']} label="Título da seção">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{filosofia.title}</h2>
        </Editable>
        <Editable path={['finops', 'filosofia', 'text']} label="Texto">
          <p className="mt-4 text-slate-400">{filosofia.text}</p>
        </Editable>
        <Editable path={['finops', 'filosofia', 'quote']} label="Citação">
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
            <Quote className="mb-2 text-emerald-400/70" size={22} strokeWidth={1.75} />
            <p className="text-lg font-medium italic text-emerald-300">{filosofia.quote}</p>
          </div>
        </Editable>
      </section>

      <BackToTopButton />

      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500 sm:px-10 lg:px-16">
        Cloud Governance &amp; FinOps Engineer · Geisa dos Reis
      </footer>
    </div>
  )
}
