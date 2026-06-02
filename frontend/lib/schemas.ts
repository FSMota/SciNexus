import { z } from 'zod'

import { categoryLabels, type CategoryName } from '@/components/catalog/catalog-data'

const categoryNames = Object.keys(categoryLabels) as [CategoryName, ...CategoryName[]]

export const authTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
})

export const currentUserSchema = z.object({
  id: z.number(),
  email: z.email(),
  username: z.string(),
  full_name: z.string().nullable(),
  is_active: z.boolean(),
})

export const loginFormSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
})

export const registerFormSchema = z.object({
  full_name: z.string().trim().min(1, 'O nome completo é obrigatório'),
  username: z.string().trim().min(3, 'O nome de usuário deve ter pelo menos 3 caracteres'),
  email: z.email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
})

export const eventFormSchema = z.object({
  titulo: z.string().trim().min(1, 'O título é obrigatório'),
  categoria: z.enum(categoryNames, { message: 'Selecione uma categoria' }),
  data_inicio: z.string().min(1, 'A data de início é obrigatória'),
  data_fim: z.string().optional(),
  local: z.string().trim().min(1, 'O local é obrigatório'),
  status: z.enum(['inscrições abertas', 'inscrições encerradas']),
  submissoes_abertas: z.boolean(),
  resumo: z.string().trim().min(1, 'O resumo é obrigatório'),
  tags: z.string(),
  numero_participantes: z.number().int().min(0, 'O número de participantes deve ser maior ou igual a zero'),
})

export const backendEventSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  categoria: z.enum(categoryNames),
  data_inicio: z.string(),
  data_fim: z.string().nullable(),
  local: z.string(),
  status: z.string(),
  submissoes_abertas: z.boolean(),
  numero_participantes: z.number(),
  destaque: z.boolean(),
  resumo: z.string(),
  tags: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
})

export const backendEventArraySchema = z.array(backendEventSchema)

export const eventRelationSchema = z.object({
  id: z.number(),
  event_id: z.number(),
  user_id: z.number(),
  role: z.enum(['ouvinte', 'pesquisador', 'revisor', 'organizador']),
  status: z.enum(['pendente', 'ativo', 'cancelado', 'rejeitado']),
  approved_by_user_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const catalogEventSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  category: z.enum(categoryNames),
  date: z.string(),
  sortDate: z.string(),
  location: z.string(),
  status: z.string(),
  submissionsOpen: z.boolean(),
  attendees: z.string(),
  highlight: z.boolean(),
  summary: z.string(),
  tags: z.array(z.string()),
})

export const catalogEventArraySchema = z.array(catalogEventSchema)

export type LoginFormValues = z.infer<typeof loginFormSchema>
export type RegisterFormValues = z.infer<typeof registerFormSchema>
export type EventFormValues = z.infer<typeof eventFormSchema>