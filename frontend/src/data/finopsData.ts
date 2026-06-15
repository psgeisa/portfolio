import type { LucideIcon } from 'lucide-react'
import {
  Eye,
  BrainCircuit,
  MessageSquareCode,
  ShieldCheck,
  Database,
  FileSpreadsheet,
  AlertTriangle,
  Activity,
  Compass,
  Layers,
  LineChart,
  Workflow,
  Sparkles,
  Lock,
} from 'lucide-react'

export interface HeroTag {
  label: string
}

export const heroTags: HeroTag[] = [
  { label: 'FinOps' },
  { label: 'Cloud Governance' },
  { label: 'Forecast' },
  { label: 'Self-Service Analytics' },
  { label: 'Azure' },
  { label: 'Databricks' },
  { label: 'Python' },
  { label: 'SQL' },
]

export interface PillarDetails {
  paragraphs: string[]
  tags: string[]
}

export interface Pillar {
  title: string
  icon: LucideIcon
  items: string[]
  details?: PillarDetails
}

export const pillars: Pillar[] = [
  {
    title: 'Transparência Financeira',
    icon: Eye,
    items: ['Alocação de custos', 'Visibilidade por time', 'Accountability'],
    details: {
paragraphs: [
  'Estruturei mecanismos de governança e rastreabilidade financeira em cloud, criando padrões de tagueamento, políticas automatizadas e uma arquitetura de accountability financeira para garantir que os recursos fossem provisionados já com os metadados necessários para identificação de time, produto, ambiente e centro de custo.',
  'Essas informações passaram a alimentar os modelos de alocação e distribuição de custos, permitindo análises mais granulares, mecanismos de atribuição e fallback para recursos sem tags, além de maior transparência sobre quem consome recursos e onde os investimentos estão sendo realizados.',
],
      tags: ['JSON', 'Azure Policy', 'Tagging', 'Billing & Usage', 'Cost Allocation'],
    },
  },
  {
    title: 'Inteligência Executiva',
    icon: BrainCircuit,
    items: ['Reports automatizados', 'Diagnóstico de variações', 'Forecast de custos'],
    details: {
      paragraphs: [
        'Desenvolvi reports executivos automatizados para diretoria e presidência, consolidando informações financeiras do consumo cloud. A solução combina análises descritivas, diagnósticos de variações e forecast de custos, transformando dados de billing em informações estratégicas para acompanhamento e tomada de decisão.',
        'E para devs e líderes de projetos, desenvolvi dashboards operacionais em Databricks para acompanhamento diário dos custos cloud. As análises permitem visualizar o consumo com granularidade por recurso, workload, job, usuário, ambiente e centro de custo, apoiando investigações, identificação de desperdícios e oportunidades de otimização.',
      ],
      tags: ['Python', 'Databricks', 'Forecast', 'Cost Analytics', 'Executive Reporting'],
    },
  },
  {
    title: 'Self-Service Analytics',
    icon: MessageSquareCode,
    items: ['Databricks Genie', 'Consulta NLP', 'Gráficos por autonomia dos times'],
    details: {
      paragraphs: [
        'Implementei uma solução de Self-Service Analytics baseada em Databricks Genie, transformando consultas financeiras em análises de autoatendimento realizadas pelos próprios times através de linguagem natural.',
        'A plataforma utiliza views segmentadas por time e possibilita a exploração autônoma dos custos cloud, incluindo geração de gráficos e análises sob demanda, reduzindo a dependência da persona de FinOps para consultas recorrentes.',
      ],
      tags: ['Databricks Genie', 'SQL', 'Views', 'Cost Visibility', 'Natural Language Query'],
    },
  },
  {
    title: 'Governança Cloud',
    icon: ShieldCheck,
    items: ['Azure Governance', 'RBAC', 'Policies', 'Azure Monitor'],
    details: {
      paragraphs: [
        'Desenhei e implementei a arquitetura de governança cloud da organização, criando padrões organizacionais para ambientes Azure, Databricks e Azure DevOps.',
        'A solução combinou estruturas por time, controles de acesso baseados em RBAC, Azure Policies e padrões de provisionamento, garantindo escalabilidade, segurança, governança operacional e alinhamento com os processos de FinOps.',
      ],
      tags: ['Azure Governance', 'RBAC', 'Azure Policies', 'Cloud Architecture', 'Environment Management'],
    },
  },
]

export type ImpactType =
  | 'Autonomia e cultura FinOps'
  | 'Inteligência executiva'
  | 'Transparência e accountability'
  | 'Observabilidade financeira'
  | 'Eficiência operacional'

export const impactIcons: Record<ImpactType, LucideIcon> = {
  'Autonomia e cultura FinOps': Sparkles,
  'Inteligência executiva': LineChart,
  'Transparência e accountability': Lock,
  'Observabilidade financeira': AlertTriangle,
  'Eficiência operacional': Activity,
}

export interface Product {
  name: string
  challenge: string
  solution: string
  benefits: string[]
  technologies: string[]
  impact: ImpactType
}

export const products: Product[] = [
  {
    name: 'FinOps Self-Service Analytics',
    challenge:
      'As análises de custos cloud dependiam de solicitações manuais para a equipe responsável, reduzindo a autonomia dos times e aumentando o tempo de resposta para dúvidas recorrentes.',
    solution:
      'Criação de um chatbot com Databricks Genie conectado às views de custos de cada time, permitindo que gestores e áreas consumidoras consultem seus próprios custos, façam perguntas em linguagem natural e gerem gráficos de forma autônoma.',
    benefits: [
      'Democratização do acesso aos dados financeiros',
      'Redução da dependência da equipe de FinOps',
      'Maior autonomia dos times',
      'Aceleração da investigação de desvios',
      'Expansão da cultura FinOps',
    ],
    technologies: ['Databricks Genie', 'SQL', 'Views', 'Azure', 'Governança de Dados'],
    impact: 'Autonomia e cultura FinOps',
  },
  {
    name: 'Executive FinOps Intelligence',
    challenge:
      'Diretoria e presidência precisavam acompanhar a evolução dos custos cloud, entender variações relevantes e antecipar tendências de consumo sem depender de análises manuais sob demanda.',
    solution:
      'Desenvolvi uma solução de comunicação executiva para FinOps, automatizando reports (Python/HTML), conectados a análises descritivas, diagnósticas e forecast de custos.',
    benefits: [
      'Visibilidade recorrente para liderança',
      'Diagnóstico de variações financeiras',
      'Antecipação de tendências de consumo',
      'Redução de esforço manual em análises executivas',
      'Apoio à tomada de decisão estratégica',
    ],
    technologies: ['Executive FinOps Intelligence', 'Cost Forecasting', 'Variance Analysis', 'Python Automation'],
    impact: 'Inteligência executiva',
  },
  {
    name: 'Cloud Cost Allocation & Accountability',
    challenge:
      'Custos cloud concentrados ou pouco detalhados dificultavam a compreensão de consumo por time, projeto ou centro de custo.',
    solution:
      'Estruturação de mecanismos de alocação, rateio, tagueamento e associação dos custos aos respectivos times consumidores, aumentando a rastreabilidade e a responsabilidade financeira.',
    benefits: [
      'Maior clareza sobre quem consome recursos',
      'Melhoria na qualidade das análises de variação',
      'Suporte a decisões de orçamento',
      'Fortalecimento da accountability',
      'Base para cultura FinOps mais madura',
    ],
    technologies: ['Azure Billing', 'Tags', 'Azure Allocation', 'Azure Policy'],
    impact: 'Transparência e accountability',
  },
  {
    name: 'Cost Anomaly Detection',
    challenge:
      'Aumentos inesperados de custos podiam passar despercebidos até o fechamento ou análise manual posterior.',
    solution:
      'Criação de monitoramentos e alertas para identificar variações anormais de consumo, desvios financeiros e comportamentos fora do padrão.',
    benefits: [
      'Identificação mais rápida de desvios',
      'Redução do risco de surpresa financeira',
      'Apoio à investigação de causas',
      'Maior controle sobre consumo cloud',
      'Evolução da observabilidade financeira',
    ],
    technologies: ['Anomaly Detection', 'Financial Observability', 'Cost Monitoring', 'Operational Analytics'],
    impact: 'Observabilidade financeira',
  },
  {
    name: 'Cloud Operations Intelligence',
    challenge:
      'Eventos operacionais como clusters fora de horário, execuções longas e falhas impactavam custos, performance e eficiência operacional.',
    solution:
      'Criação de monitoramentos para conectar eventos operacionais ao impacto financeiro, permitindo identificar desperdícios, falhas e oportunidades de otimização.',
    benefits: [
      'Maior eficiência operacional',
      'Redução de desperdícios',
      'Identificação de recursos ociosos',
      'Melhor conexão entre operação e custo',
      'Apoio a decisões de otimização',
    ],
    technologies: ['Cost Optimization', 'Azure Monitor', 'Cloud Observability', 'Operational Analytics'],
    impact: 'Eficiência operacional',
  },
]

export interface JourneyStep {
  title: string
  description: string
  icon: LucideIcon
}

export const journeySteps: JourneyStep[] = [
  { title: 'Visibilidade', description: 'Organização dos dados de billing e consumo', icon: Eye },
  {
    title: 'Alocação',
    description: 'Associação de custos a times, projetos e centros de custo',
    icon: Layers,
  },
  {
    title: 'Análise',
    description: 'Dashboards, relatórios, diagnóstico e forecast',
    icon: LineChart,
  },
  {
    title: 'Automação',
    description: 'Reports executivos, alertas e monitoramentos',
    icon: Workflow,
  },
  {
    title: 'Autonomia',
    description: 'Self-service analytics com linguagem natural',
    icon: MessageSquareCode,
  },
  {
    title: 'Governança',
    description: 'Políticas, RBAC, rastreabilidade e melhoria contínua',
    icon: ShieldCheck,
  },
]

export interface TechGroup {
  title: string
  icon: LucideIcon
  items: string[]
}

export const techGroups: TechGroup[] = [
  {
    title: 'Dados & Analytics',
    icon: Database,
    items: ['SQL Server', 'Data Warehouse', 'Databricks Catalog', 'Azure Blob Storage', 'Integração de Dados', 'Governança de Dados'],
  },
  {
    title: 'Cloud & Governança',
    icon: Compass,
    items: ['Azure Billing', 'Azure Monitor', 'Azure Logs', 'RBAC', 'Custom-role', 'Azure Policies', 'KQL', 'JSON'],
  },
  {
    title: 'FinOps',
    icon: FileSpreadsheet,
    items: ['Cost Allocation', 'Billing & Usage', 'Forecast', 'Budget Tracking', 'Anomaly Detection', 'Chargeback / Showback'],
  },
  {
    title: 'Produto & Automação',
    icon: Workflow,
    items: ['Reportings', 'Logic Apps', 'Monitorings', 'Dashboards', 'Databricks Genie'],
  },
]
