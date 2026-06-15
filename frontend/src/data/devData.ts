import type { LucideIcon } from 'lucide-react'
import { ClipboardList, Layers, Database, RefreshCw, Code2, Server, BrainCircuit, GitBranch, Compass } from 'lucide-react'

export interface DevApp {
  name: string
  items?: string[]
  groups?: { heading: string; items: string[] }[]
  back?: {
    problema: string
    beneficios: string[]
  }
}

export interface DevBlock {
  heading: string
  items?: string[]
  columns?: 2 | 3
  apps?: DevApp[]
  carousel?: boolean
}

export interface DevSection {
  title: string
  icon: LucideIcon
  note?: string
  blocks: DevBlock[]
  closing?: { paragraph: string; quote: string }
}

export const devTags = ['React', 'Tailwind CSS', 'Vite', 'Flask', 'Python', 'SQL', 'Git', 'Vercel']

export const devTimeline = [
  {
    ano: '2020–2022',
    texto:
      'Desenvolvimento de aplicações internas em Power Platform para digitalizar processos, validar ideias rapidamente e entregar soluções com baixo tempo de implementação e adoção.',
  },
  {
    ano: '2023',
    texto:
      'Estruturação da governança em Azure, consolidando serviços, acessos, e padrões para crescimento sustentável das soluções de processos de automação e aplicações transacionais.',
  },
  {
    ano: '2024',
    texto:
      'Implementação de integrações entre Azure e Microsoft 365, conectando aplicações, identidades, API Permissions, MS Graph e base de dados para automações e serviços utilizados pelas áreas de negócio.',
  },
  {
    ano: '2025',
    texto:
      'Migração da primeira aplicação crítica para arquitetura web moderna, preservando regras de negócio, processos existentes, integrações e experiência dos usuários.',
  },
  {
    ano: '2026',
    texto:
      'Apoio à modernização do portfólio de aplicações internas, conduzindo a evolução gradual de soluções low-code para arquiteturas escaláveis baseadas em desenvolvimento Full Stack.',
  },
]

export const devIntro =
  'Ao longo dos últimos anos participei da criação de soluções para diferentes áreas da empresa. Minha atuação normalmente envolve entender o problema, desenhar a solução, estruturar os dados e transformar a ideia em uma aplicação funcional.'

export const devSections: DevSection[] = [
  {
    title: 'Desenvolvimento de Aplicações Corporativas',
    icon: ClipboardList,
    blocks: [
      {
        heading: 'Levantamento e análise de requisitos',
        columns: 3,
        items: [
          'Identificação e definição do problema',
          'Requisitos funcionais',
          'Requisitos não funcionais',
          'Mapeamento de stakeholders',
          'Modelagem de processos',
          'Documentação técnica e funcional',
          'Elaboração de diagramas UML',
          'Definição de fluxos de sistema',
          'Definição de fluxos de navegação',
          'Experiência do usuário',
        ],
      },
      {
        heading: 'Aplicações desenvolvidas',
        carousel: true,
        apps: [
          {
            name: 'Sistema de Controle de Férias',
            items: [
              'Gestão do planejamento de férias dos colaboradores',
              'Fluxo de aprovação',
              'Integração com base corporativa de colaboradores',
              'Controle de períodos aquisitivos',
            ],
            back: {
              problema:
                'O planejamento de férias era descentralizado e sujeito a erros operacionais, dificultando o controle dos períodos aquisitivos e o acompanhamento das aprovações.',
              beneficios: [
                'Centralização do planejamento de férias',
                'Controle automatizado de períodos aquisitivos',
                'Fluxo estruturado de aprovações',
                'Integração com a base corporativa de colaboradores',
              ],
            },
          },
          {
            name: 'Sistema de Gestão de Currículos',
            items: [
              'Integração com site institucional',
              'Integração com Microsoft Forms',
              'Automação do processo de recrutamento',
              'Estruturação dos dados para eliminar análise manual de documentos',
              'Transformação dos currículos em registros estruturados para o RH',
            ],
            back: {
              problema:
                'O processo de recrutamento dependia da análise manual de currículos e informações dispersas, reduzindo a eficiência e a padronização das avaliações.',
              beneficios: [
                'Automatização da triagem de candidatos',
                'Integração entre formulários e site institucional',
                'Transformação de documentos em dados estruturados',
                'Redução do esforço operacional do RH',
              ],
            },
          },
          {
            name: 'Sistema de Reserva de Mesas',
            items: [
              'Controle de ocupação de mesas',
              'Regras de alocação fixa por equipe',
              'Regras diferenciadas por semana',
              'Gestão da capacidade dos ambientes',
            ],
            back: {
              problema:
                'A utilização dos espaços compartilhados exigia controles manuais, dificultando a gestão da capacidade dos ambientes e a aplicação das regras de ocupação.',
              beneficios: [
                'Controle centralizado das reservas',
                'Melhor utilização dos espaços físicos',
                'Aplicação automática das regras de alocação',
                'Visibilidade da ocupação dos ambientes',
              ],
            },
          },
          {
            name: 'Sistema de Gestão de Pessoas',
            items: [
              'Aplicação centralizadora de dados cadastrais',
              'Integração com múltiplos sistemas internos',
              'Base única de colaboradores utilizada por outros aplicativos corporativos',
            ],
            back: {
              problema:
                'Informações cadastrais de colaboradores estavam distribuídas em diferentes sistemas, gerando inconsistências e dificultando o consumo dos dados por aplicações corporativas.',
              beneficios: [
                'Criação de uma fonte única de dados de pessoas',
                'Integração entre sistemas corporativos',
                'Padronização das informações cadastrais',
                'Reutilização dos dados por múltiplas aplicações',
              ],
            },
          },
          {
            name: 'Portal de Pessoas',
            items: [
              'Diretório corporativo integrado',
              'Visualização hierárquica por áreas e equipes',
              'Perfis com biografia e histórico organizacional',
              'Comunicação direta via Teams, telefone e e-mail',
            ],
            back: {
              problema:
                'Encontrar informações sobre colaboradores, entender a estrutura organizacional e localizar os canais corretos de contato exigia consultas em múltiplos sistemas e fontes distintas.',
              beneficios: [
                'Centralização das informações dos colaboradores',
                'Visualização da estrutura organizacional e equipes',
                'Facilidade para localizar especialistas e responsáveis',
                'Integração direta com Teams, e-mail e telefonia',
              ],
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Arquitetura e Plataforma Low Code',
    icon: Layers,
    note: 'Além do desenvolvimento dos aplicativos, atuação na estruturação do ecossistema.',
    blocks: [
      {
        heading: 'Atividades',
        items: [
          'Definição de padrões de desenvolvimento',
          'Apoio técnico para novos desenvolvedores Low Code',
          'Governança das aplicações',
          'Integração de plataformas corporativas',
          'Disseminação de boas práticas',
        ],
      },
    ],
  },
  {
    title: 'Integração de Dados e Cloud',
    icon: Database,
    blocks: [
      {
        heading: 'Databricks',
        items: [
          'Estruturação da conectividade entre Power Platform e Databricks',
          'Disponibilização conectividade para aplicações internas',
          'Apoio na consolidação da estratégia de dados em nuvem',
        ],
      },
      {
        heading: 'Azure',
        items: [
          'Participação na consolidação do ambiente cloud corporativo',
          'Migração de processos internos para arquitetura cloud',
          'Adequação de aplicações às novas diretrizes tecnológicas',
        ],
      },
    ],
  },
  {
    title: 'Modernização de Sistemas',
    icon: RefreshCw,
    blocks: [
      {
        heading: 'Aplicações',
        apps: [
          {
            name: 'Migração da Régua de Risco de Crédito',
            items: [
              'Conversão de processo originalmente executado em plataforma Low Code',
              'Redesenho da solução para arquitetura web',
              'Revisão das regras de negócio',
              'Modernização tecnológica da aplicação',
            ],
          },
          {
            name: 'Migração do Sistema de Gestão de Pessoas',
            items: [
              'Apoio consultivo na migração do aplicativo para Flask, React e Vite',
              'Orientação sobre estruturação da base de dados',
              'Definição da conectividade com warehouse Databricks e SQL Serverless',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Desenvolvimento Web Full Stack',
    icon: Code2,
    note: 'Posteriormente, desenvolvimento de aplicações utilizando frameworks tradicionais.',
    blocks: [
      {
        heading: 'Aplicações desenvolvidas',
        apps: [
          {
            name: 'Aplicação de Análise de NDAs',
            groups: [
              {
                heading: 'Funcionalidades',
                items: [
                  'Upload e processamento de docs',
                  'Análise assistida por IA',
                  'Extração e sumarização de informações',
                  'Reescrita de textos problemáticos',
                  'Entrega de editável para validação',
                  'Apoio à avaliação contratual',
                ],
              },
              {
                heading: 'Ferramentas',
                items: ['Python', 'Flask', 'React', 'LLM', 'Generative AI', 'TrackChanges O365'],
              },
            ],
            back: {
              problema:
                'Analisar contratos de confidencialidade manualmente consumia tempo dos times, gerava inconsistências entre avaliações e dificultava a identificação rápida de cláusulas que exigiam atenção jurídica ou operacional.',
              beneficios: [
                'Redução do tempo de análise contratual',
                'Padronização das avaliações realizadas',
                'Identificação assistida de cláusulas críticas',
                'Geração de documentos revisáveis para validação humana',
              ],
            },
          },
          {
            name: 'Sistema de Fluxo de Aprovações',
            groups: [
              {
                heading: 'Funcionalidades',
                items: [
                  'Workflow dinâmico de aprovação',
                  'Regras parametrizáveis',
                  'Gestão de stakeholders',
                  'Controle de status/votos e histórico',
                  'Prompts selecionáveis para resumos padronizados',
                  'Faq-LLM atrelado a base interna',
                ],
              },
              {
                heading: 'Ferramentas',
                items: ['Python/SQL Server', 'Git/Azure DevOps', 'Flask/React/Vite', 'Logic Apps', 'Wharehouse', 'LLM'],
              },
            ],
            back: {
              problema:
                'Os processos de aprovação dependiam de controles descentralizados, dificultando o acompanhamento das decisões, a aplicação consistente das regras e a rastreabilidade das aprovações.',
              beneficios: [
                'Centralização dos fluxos de aprovação',
                'Rastreabilidade completa das decisões',
                'Automação de regras e encaminhamentos',
                'Padronização da geração de resumos executivos',
              ],
            },
          },
          {
            name: 'Metas Flow',
            groups: [
              {
                heading: 'Funcionalidades',
                items: [
                  'Registro de Metas e Avaliações PDI',
                  'Fluxo de aprovações de metas/notas',
                  'Simulações de distribuição de resultados',
                  'Auditoria e rastreabilidade do processo',
                  'Cálculo de remuneração variável',
                ],
              },
              {
                heading: 'Tecnologias',
                items: ['Python/SQL Server', 'Git/Azure DevOps', 'Flask/React/Vite', 'Logic Apps', 'RBACs'],
              },
            ],
            back: {
              problema:
                'Cada área possuía critérios próprios para avaliação de desempenho e distribuição de resultados, tornando o processo difícil de consolidar, auditar e administrar em uma única plataforma.',
              beneficios: [
                'Centralização da gestão de metas e avaliações',
                'Flexibilidade para diferentes regras por área',
                'Automatização dos cálculos de remuneração variável',
                'Transparência e auditabilidade do processo',
              ],
            },
          },
        ],
      },
    ],
  },
]

export interface TechGroup {
  title: string
  icon: LucideIcon
  items: string[]
}

export const devTechGroups: TechGroup[] = [
  {
    title: 'Front-end',
    icon: Code2,
    items: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Vite'],
  },
  {
    title: 'Back-end',
    icon: Server,
    items: ['Python', 'Flask', 'APIs REST', 'Integração de Sistemas', 'Autenticação', 'RBAC'],
  },
  {
    title: 'Dados & Analytics',
    icon: Database,
    items: ['SQL Server', 'Data Warehouse', 'Databricks Catalog', 'Azure Blob Storage', 'Integração de Dados', 'Governança de Dados'],
  },
  {
    title: 'IA Aplicada',
    icon: BrainCircuit,
    items: ['LLM Integration', 'Prompt Engineering', 'RAG', 'Document Processing', 'Speech-to-Text', 'Foundry Models/Tools'],
  },
  {
    title: 'DevOps & Versionamento',
    icon: GitBranch,
    items: ['Git', 'Azure DevOps', 'Branching Strategy', 'Pull Requests', 'CI/CD', 'Release Management'],
  },
  {
    title: 'Product & Project Management',
    icon: Compass,
    items: ['Agile', 'CRISP-DM', 'Microsoft Planner', 'Gestão de Stakeholders', 'Levantamento de Requisitos', 'Planejamento de Projetos'],
  },
]

export const devSummary = {
  paragraph:
    'Não se trata de uma "desenvolvedora Power Platform". A trajetória é a de uma profissional com experiência em análise de sistemas, desenvolvimento de aplicações corporativas e modernização de processos, atuando desde a definição de requisitos e modelagem de soluções até a implementação de aplicações Low Code e Full Stack em ambientes cloud. Experiência na construção de sistemas de RH, gestão de pessoas, reservas, workflows de aprovação, análise documental e integração de dados corporativos utilizando Power Platform, React, Flask, Python, Databricks e Azure.',
  quote:
    'Não apenas desenvolvi telas; desenhei e implementei soluções completas de negócio.',
}
