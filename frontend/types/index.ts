import { articleSubmissionFormSchema } from "@/lib/schemas"
import { z } from "zod"

export type User = {
  id: number
  email: string
  username: string
  full_name: string | null
  is_active: boolean
  tags?: string[]
}

export type LoginResponse = {
  access_token: string
  token_type: string
}

export type ArticleSubmissionFormValues = z.infer<typeof articleSubmissionFormSchema>
