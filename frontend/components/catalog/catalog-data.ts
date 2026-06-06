export const sortOptions = ['Mais recentes', 'Em destaque'] as const

export const categoryStyles = {
  tecnologia: 'from-sky-500 to-blue-600 bg-sky-50 text-sky-900 border-sky-200',
  saúde: 'from-emerald-500 to-teal-600 bg-emerald-50 text-emerald-800 border-emerald-200',
  engenharia: 'from-amber-400 to-yellow-500 bg-amber-50 text-amber-800 border-amber-200',
  educação: 'from-rose-500 to-pink-600 bg-rose-50 text-rose-900 border-rose-200',
  direito: 'from-violet-500 to-fuchsia-600 bg-violet-50 text-violet-900 border-violet-200',
} as const

export type CategoryName = keyof typeof categoryStyles

export const categoryLabels: Record<CategoryName, string> = {
  tecnologia: 'Tecnologia',
  saúde: 'Saúde',
  engenharia: 'Engenharia',
  educação: 'Educação',
  direito: 'Direito',
}
