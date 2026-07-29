import { USER_LOGIN, GET_USERS, ADMIN_USER_LOGOUT, GET_ADMIN_USER_BY_PROPERTIES } from '@/graphql/user.graphql'
import { Response } from '@/type/api.response.type'
import { GetAdminUserByPropertiesPayload, UserLoginPayload } from '@/type/adminUser.type'
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
  console.log('logout result: ', result)
  return result
}

export async function getAdminUserByProperties(filter: GetAdminUserByPropertiesPayload): Promise<Response['GetAdminUserByProperties']> {
  const result = await fetchAPI<'GetAdminUserByProperties'>(apiUrl, GET_ADMIN_USER_BY_PROPERTIES, filter)
  return result
}