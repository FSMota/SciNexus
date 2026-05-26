export const sortOptions = ['Mais recentes', 'Em destaque'] as const

export const categoryStyles = {
  Tecnologia: 'from-sky-500 to-blue-600 bg-sky-50 text-sky-900 border-sky-200',
  Saúde: 'from-emerald-500 to-teal-600 bg-emerald-50 text-emerald-800 border-emerald-200',
  Engenharia: 'from-amber-400 to-yellow-500 bg-amber-50 text-amber-800 border-amber-200',
  Educação: 'from-rose-500 to-pink-600 bg-rose-50 text-rose-900 border-rose-200',
} as const

export type CategoryName = keyof typeof categoryStyles

export type CatalogEvent = {
  title: string
  category: CategoryName
  date: string
  sortDate: string
  location: string
  status: string
  attendees: string
  highlight: boolean
  summary: string
  tags: string[]
}

export const catalogEvents: CatalogEvent[] = [
  {
    title: 'Congresso Brasileiro de IA Aplicada',
    category: 'Tecnologia',
    date: '14-16 Jun 2026',
    sortDate: '2026-06-14',
    location: 'São Paulo, SP',
    status: 'Inscrições abertas',
    attendees: '420 participantes',
    highlight: true,
    summary: 'Sessões sobre modelos generativos, MLOps e pesquisa aplicada em inteligência artificial.',
    tags: ['IA', 'Workshop', 'Keynote'],
  },
  {
    title: 'Simpósio de Inovação em Saúde Digital',
    category: 'Saúde',
    date: '02-04 Jul 2026',
    sortDate: '2026-07-02',
    location: 'Recife, PE',
    status: 'Submissões abertas',
    attendees: '180 participantes',
    highlight: false,
    summary: 'Telemedicina, analytics clínico e soluções digitais para gestão em saúde.',
    tags: ['Saúde digital', 'Pesquisa', 'Dados'],
  },
  {
    title: 'Semana de Engenharia e Prototipagem',
    category: 'Engenharia',
    date: '21-24 Jul 2026',
    sortDate: '2026-07-21',
    location: 'Belo Horizonte, MG',
    status: 'Programação definida',
    attendees: '300 participantes',
    highlight: true,
    summary: 'Projetos de hardware, prototipagem rápida e aplicações industriais.',
    tags: ['Protótipos', 'Indústria 4.0', 'Labs'],
  },
  {
    title: 'Fórum de Pesquisa e Educação 4.0',
    category: 'Educação',
    date: '11-13 Ago 2026',
    sortDate: '2026-08-11',
    location: 'Curitiba, PR',
    status: 'Chamada de trabalhos',
    attendees: '150 participantes',
    highlight: false,
    summary: 'Tecnologias educacionais, metodologias híbridas e inovação acadêmica.',
    tags: ['Ensino híbrido', 'Letramento', 'EdTech'],
  },
  {
    title: 'Simpósio Latino-americano de Dados Abertos',
    category: 'Tecnologia',
    date: '28-30 Ago 2026',
    sortDate: '2026-08-28',
    location: 'Porto Alegre, RS',
    status: 'Inscrições em breve',
    attendees: '260 participantes',
    highlight: false,
    summary: 'Governança de dados, APIs abertas e interoperabilidade científica.',
    tags: ['Open Data', 'APIs', 'Governança'],
  },
  {
    title: 'Congresso de Bioinformática e Saúde Pública',
    category: 'Saúde',
    date: '09-11 Set 2026',
    sortDate: '2026-09-09',
    location: 'Fortaleza, CE',
    status: 'Programação em revisão',
    attendees: '340 participantes',
    highlight: true,
    summary: 'Análise genômica, epidemiologia computacional e vigilância em saúde.',
    tags: ['Genômica', 'Bioinfo', 'Epidemiologia'],
  },
  {
    title: 'Workshop de Robótica e Sistemas Embarcados',
    category: 'Engenharia',
    date: '18-20 Set 2026',
    sortDate: '2026-09-18',
    location: 'Campinas, SP',
    status: 'Inscrições abertas',
    attendees: '220 participantes',
    highlight: false,
    summary: 'Automação, sensores, controle e integração de sistemas físicos.',
    tags: ['Robótica', 'IoT', 'Hardware'],
  },
  {
    title: 'Seminário de Inovação Pedagógica',
    category: 'Educação',
    date: '03-05 Out 2026',
    sortDate: '2026-10-03',
    location: 'Florianópolis, SC',
    status: 'Submissões abertas',
    attendees: '200 participantes',
    highlight: false,
    summary: 'Modelos de aprendizagem, avaliação e desenho de experiências educacionais.',
    tags: ['Pedagogia', 'Avaliação', 'Pesquisa'],
  },
  {
    title: 'Cúpula de IA e Ética Algorítmica',
    category: 'Tecnologia',
    date: '15-17 Out 2026',
    sortDate: '2026-10-15',
    location: 'Brasília, DF',
    status: 'Lista de palestrantes disponível',
    attendees: '310 participantes',
    highlight: true,
    summary: 'Transparência, regulação e aplicação responsável de sistemas inteligentes.',
    tags: ['Ética', 'Regulação', 'IA'],
  },
  {
    title: 'Conferência de Engenharia de Produção',
    category: 'Engenharia',
    date: '02-04 Nov 2026',
    sortDate: '2026-11-02',
    location: 'Curitiba, PR',
    status: 'Programação preliminar',
    attendees: '270 participantes',
    highlight: false,
    summary: 'Processos, operações e pesquisa aplicada em sistemas produtivos.',
    tags: ['Processos', 'Operações', 'Pesquisa aplicada'],
  },
  {
    title: 'Encontro de Educação e Dados Abertos',
    category: 'Educação',
    date: '19-21 Nov 2026',
    sortDate: '2026-11-19',
    location: 'Salvador, BA',
    status: 'Chamada aberta',
    attendees: '165 participantes',
    highlight: true,
    summary: 'Compartilhamento de dados, reuso acadêmico e colaboração entre instituições.',
    tags: ['Dados abertos', 'Colaboração', 'Ensino'],
  },
]
