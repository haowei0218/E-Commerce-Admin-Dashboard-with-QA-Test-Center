import { USER_LOGIN } from '@/graphql/user.graphql'
import { Response } from '@/type/api.response.type'
import { UserLoginPayload } from '@/type/user.login.type'
import { fetchAPI } from '@/utils/api.utils'

const apiUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:4201/graphql'

export async function userLogin({
  account,
  password,
}: UserLoginPayload): Promise<Response['UserLogin']> {
  const result = await fetchAPI<'UserLogin'>(apiUrl, USER_LOGIN, {
    account,
    password,
  })
  return result
}
