export type User = {
  id: number
  email: string
  username: string
  full_name: string | null
  is_active: boolean
}

export type LoginResponse = {
  access_token: string
  token_type: string
}
