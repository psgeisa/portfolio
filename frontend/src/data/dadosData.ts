import type { LucideIcon } from 'lucide-react'
import {
  LineChart,
  TrendingUp,
  Sparkles,
  LayoutGrid,
  Database,
  BrainCircuit,
  Activity,
  Lock,
} from 'lucide-react'

export const dadosTags = [
  'Data Products',
  'Decision Intelligence',
  'Analytics Engineering',
  'Generative AI',
  'Business Intelligence',
  'Data Science',
  'Databricks',
  'Python',
  'SQL',
  'Power BI',
  'NLP',
  'Machine Learning',
]

export const dadosIntro =
  'Acredito que dados geram valor quando deixam de ser apenas informação e passam a orientar decisões. Meu trabalho consiste em transformar dados, análises e inteligência artificial em produtos utilizáveis pelo negócio, conectando tecnologia, contexto e experiência do usuário para tornar informações complexas mais acessíveis, acionáveis e escaláveis.'

export const dadosFilosofia = [
  dadosIntro,
  'Atuo desde a estruturação de bases e modelos analíticos até a construção de aplicações, automações e soluções de IA que aproximam pessoas dos dados. Mais do que produzir análises, busco criar mecanismos que ampliem a autonomia dos usuários e acelerem a tomada de decisão.',
]

export interface Pillar {
  title: string
  icon: LucideIcon
  items: string[]
  description: string
  experiencias: string[]
  tecnologias: string[]
  highlight?: string
}

export const dadosPillars: Pillar[] = [
  {
    title: 'Business Intelligence & Analytics',
    icon: LayoutGrid,
    items: ['Dashboards Executivos', 'KPIs Estratégicos', 'Analytics Operacional'],
    description:
      'Desenvolvimento de soluções analíticas para acompanhamento de indicadores financeiros, operacionais e corporativos, transformando grandes volumes de dados em informações acessíveis para gestores, especialistas e liderança.',
    experiencias: [
      'Dashboards FinOps',
      'Dashboards de custos cloud',
      'Dashboards executivos',
      'Indicadores de utilização',
      'Relatórios automatizados',
      'Análises de variação',
      'KPIs operacionais',
    ],
    tecnologias: ['Power BI', 'DAX', 'SQL', 'Databricks', 'Python', 'Data Visualization'],
  },
  {
    title: 'Forecast & Advanced Analytics',
    icon: TrendingUp,
    items: ['Forecast', 'Análise de Tendências', 'Simulações'],
    description:
      'Construção de modelos analíticos para projeção de cenários, identificação de tendências e suporte ao planejamento financeiro e operacional.',
    experiencias: [
      'Forecast de custos cloud',
      'Projeção de consumo',
      'Simulações orçamentárias',
      'Diagnóstico de desvios',
      'Estudos de crescimento',
    ],
    tecnologias: ['Python', 'Databricks', 'Statistical Analysis', 'Forecasting', 'Time Series', 'Scenario Analysis'],
  },
  {
    title: 'Generative AI & NLP',
    icon: Sparkles,
    items: ['IA Generativa', 'NLP', 'Document Intelligence'],
    description:
      'Aplicação de modelos de linguagem para interpretação de documentos, extração de informações, geração de resumos e construção de interfaces conversacionais.',
    experiencias: [
      'Chatbot financeiro',
      'Databricks Genie',
      'Resumo de crédito',
      'Resumo de notificações',
      'Resumo executivo automático',
      'NDA Analyzer',
      'Lei do Bem',
    ],
    tecnologias: ['OpenAI', 'LLM', 'Prompt Engineering', 'NLP', 'Databricks', 'Python'],
  },
  {
    title: 'Data Products',
    icon: LineChart,
    items: ['Aplicações Analíticas', 'Self-Service Analytics', 'Produtos Baseados em Dados'],
    description:
      'Construção de aplicações onde os dados deixam de ser apenas relatórios e passam a compor produtos utilizados diretamente pelos usuários finais.',
    experiencias: [
      'Metas Flow: distribuição de PLR, avaliação de desempenho e consolidação de critérios de diferentes áreas',
      'Sistema de Férias: planejamento, cálculo de saldos, integração corporativa e workflow de aprovação',
      'FinOps Self-Service: consultas em linguagem natural sobre custos cloud',
      'Fluxo de Crédito: consolidação de análises, limites e aprovações',
      'NDA Analyzer: interpretação automatizada de documentos jurídicos',
    ],
    tecnologias: ['React', 'TypeScript', 'Python', 'SQL', 'Power Platform', 'Databricks'],
  },
  {
    title: 'Data Engineering & Analytics Engineering',
    icon: Database,
    items: ['Modelagem', 'Integração', 'Governança de Dados'],
    description: 'Estruturação das bases que sustentam análises, aplicações e modelos de IA.',
    experiencias: [
      'Construção de bases auxiliares corporativas',
      'Modelagem de dados',
      'Integração de sistemas',
      'Catálogo de dados',
      'Views analíticas',
      'Estruturação de datasets para IA',
      'Consolidação de fontes distintas',
    ],
    tecnologias: ['SQL', 'Databricks', 'Azure', 'Data Modeling', 'ETL', 'Data Warehouse', 'Spark'],
  },
  {
    title: 'Decision Intelligence',
    icon: BrainCircuit,
    items: ['Dados para Decisão', 'Automação Analítica', 'Inteligência Executiva'],
    description:
      'Desenvolvimento de soluções que conectam dados, automação e inteligência artificial para apoiar decisões de negócio.',
    experiencias: [
      'Reports executivos automatizados',
      'Diagnóstico de variações',
      'Forecast financeiro',
      'Alertas inteligentes',
      'Chatbots analíticos',
      'Classificação automática de informações',
      'Sistemas de apoio à decisão',
    ],
    tecnologias: ['Python', 'Databricks', 'Power BI', 'LLM', 'Analytics', 'Automation'],
  },
]

export type DadosImpactType =
  | 'Inteligência executiva'
  | 'Eficiência operacional'
  | 'Automação inteligente'
  | 'Transparência e accountability'

export const dadosImpactIcons: Record<DadosImpactType, LucideIcon> = {
  'Inteligência executiva': LineChart,
  'Eficiência operacional': Activity,
  'Automação inteligente': Sparkles,
  'Transparência e accountability': Lock,
}

export interface Project {
  name: string
  challenge: string
  solution: string
  benefits: string[]
  useCases?: string[]
  technologies: string[]
  impact: DadosImpactType
  extraTag?: string
}

export const dadosSummary: Project = {
  name: 'Generative AI & NLP',
  challenge:
    'Processos corporativos frequentemente dependem da análise de grandes volumes de documentos, informações dispersas e solicitações recorrentes, exigindo esforço manual para consolidar conhecimento, interpretar conteúdo e produzir informações úteis para tomada de decisão.',
  solution:
    'Desenvolvimento de soluções baseadas em IA Generativa e Processamento de Linguagem Natural para transformar documentos, bases corporativas e informações não estruturadas em conhecimento acessível e acionável. As aplicações incluem assistentes inteligentes, análise documental, geração automática de resumos, classificação de informações e apoio à tomada de decisão em processos financeiros, jurídicos e corporativos.',
  benefits: [
    'Assistentes conversacionais conectados a dados corporativos',
    'Interpretação automatizada de documentos',
    'Extração estruturada de informações relevantes',
    'Geração automática de resumos executivos',
    'Apoio à análise de crédito e contratos',
    'Redução de atividades manuais e repetitivas',
    'Democratização do acesso ao conhecimento corporativo',
  ],
  useCases: [
    'Financial Intelligence Chatbot',
    'Credit Intelligence Assistant',
    'NDA Intelligence Platform',
    'Executive Summary Generator',
    'Notification Summarizer',
    'Lei do Bem Assistant',
    'Databricks Genie Solutions',
  ],
  technologies: ['Generative AI', 'LLM', 'NLP', 'Document Intelligence', 'Prompt Engineering', 'OpenAI', 'Python', 'Databricks'],
  impact: 'Automação inteligente',
  extraTag: 'AI',
}

export const dadosProjects: Project[] = [
  {
    name: 'NDA Intelligence Platform',
    challenge:
      'A análise de contratos de confidencialidade (NDAs) exigia avaliação manual de cláusulas, riscos e conformidade, consumindo tempo das equipes jurídicas e dificultando a padronização dos critérios utilizados na tomada de decisão.',
    solution:
      'Desenvolvimento de uma plataforma de análise contratual que combina NLP, IA generativa e modelos analíticos para classificar cláusulas, calcular scores de risco, detectar padrões atípicos e apoiar decisões sobre aprovação de contratos. O sistema incorpora feedback humano para mensurar acurácia, monitorar KPIs e evoluir continuamente os mecanismos de análise.',
    benefits: [
      'Redução do tempo de análise contratual',
      'Padronização da avaliação de riscos',
      'Identificação automática de cláusulas críticas e incomuns',
      'Maior consistência nas decisões de aprovação',
      'Monitoramento contínuo da qualidade das análises',
    ],
    technologies: ['NLP', 'Classification', 'Risk Scoring', 'Anomaly Detection', 'Human-in-the-Loop', 'Model Monitoring'],
    impact: 'Automação inteligente',
  },
  {
    name: 'Forecast & Advanced Analytics',
    challenge:
      'Antecipar custos cloud, consumo de recursos e tendências operacionais exigia análises recorrentes e consolidação manual de informações, dificultando o planejamento financeiro e a identificação antecipada de desvios.',
    solution:
      'Desenvolvimento de mecanismos de forecast e análise avançada para projeção de custos e consumo de recursos, utilizando padrões históricos, segmentação temporal entre dias úteis e finais de semana, identificação de tendências e simulações de cenários para apoiar o planejamento financeiro e operacional.',
    benefits: [
      'Forecast de custos cloud',
      'Projeção de consumo',
      'Simulações orçamentárias',
      'Identificação antecipada de desvios',
      'Apoio ao planejamento financeiro',
      'Maior previsibilidade operacional',
    ],
    technologies: ['Python', 'Databricks', 'Forecast Analytics', 'Trend Analysis', 'Scenario Simulation', 'Deterministic Forecasting'],
    impact: 'Inteligência executiva',
    extraTag: 'Advanced Analytics',
  },
  {
    name: 'Lei do Bem Intelligence',
    challenge:
      'O processo de enquadramento de iniciativas tecnológicas para atendimento aos requisitos da Lei do Bem exigia a consolidação de informações provenientes de diferentes sistemas corporativos, além da interpretação de evidências técnicas e elaboração de justificativas para avaliação especializada. O processo era intensivo em esforço manual e dependia da análise individual de cada projeto.',
    solution:
      'Desenvolvimento de uma solução baseada em NLP e IA Generativa para consolidar informações corporativas, interpretar evidências técnicas e apoiar a classificação de iniciativas de tecnologia segundo critérios regulatórios. A solução realiza o cruzamento automatizado de dados, gera justificativas técnicas estruturadas e incorpora validação especializada para aumentar a consistência e rastreabilidade do processo.',
    benefits: [
      'Consolidação automática de informações corporativas',
      'Classificação assistida de iniciativas tecnológicas',
      'Geração automática de justificativas técnicas',
      'Padronização das informações submetidas à avaliação',
      'Redução de esforço operacional',
      'Apoio à análise regulatória e tomada de decisão',
    ],
    technologies: ['NLP', 'Generative AI', 'LLM', 'Python', 'Databricks', 'SQL', 'Information Classification', 'Decision Support'],
    impact: 'Automação inteligente',
  },
]

export interface TechGroup {
  title: string
  icon: LucideIcon
  items: string[]
}

export const dadosTechGroups: TechGroup[] = [
  {
    title: 'Dados',
    icon: Database,
    items: ['SQL', 'Databricks', 'Spark', 'Data Warehouse', 'Azure Storage', 'Data Modeling'],
  },
  {
    title: 'Analytics',
    icon: LayoutGrid,
    items: ['Power BI', 'DAX', 'Forecasting', 'KPIs', 'Executive Reporting', 'Business Intelligence'],
  },
  {
    title: 'IA',
    icon: Sparkles,
    items: ['LLM', 'OpenAI', 'Prompt Engineering', 'NLP', 'Document Intelligence', 'Generative AI'],
  },
  {
    title: 'Desenvolvimento',
    icon: BrainCircuit,
    items: ['Python', 'TypeScript', 'React', 'Power Apps', 'Power Automate', 'REST APIs'],
  },
  {
    title: 'Cloud',
    icon: TrendingUp,
    items: ['Azure', 'Databricks', 'Azure Monitor', 'Azure DevOps', 'RBAC', 'Governança Cloud'],
  },
]
