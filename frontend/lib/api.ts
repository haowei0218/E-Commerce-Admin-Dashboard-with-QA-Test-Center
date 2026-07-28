import { USER_LOGIN, GET_USERS, ADMIN_USER_LOGOUT } from '@/graphql/user.graphql'
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

export async function getUsers(): Promise<Response['GetUsers']> {
  const result = await fetchAPI<'GetUsers'>(apiUrl, GET_USERS)
  return result
}

export async function adminUserLogout(): Promise<Response['AdminUserLogout']> {
  const result = await fetchAPI<'AdminUserLogout'>(apiUrl, ADMIN_USER_LOGOUT)
  console.log('logout result: ',result)
  return result
}