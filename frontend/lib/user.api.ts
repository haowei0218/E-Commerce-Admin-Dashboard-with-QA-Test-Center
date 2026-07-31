import { USER_LOGIN, GET_USERS, ADMIN_USER_LOGOUT, GET_ADMIN_USER_BY_PROPERTIES, CREATE_ADMIN_USER, GET_ADMIN_USER_BY_ID } from '@/graphql/user.graphql'
import { Response } from '@/type/api.response.type'
import { CreateAdminUserPayload, GetAdminUserByPropertiesPayload, UserLoginPayload } from '@/type/adminUser.type'
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

export async function createAdminUser(adminUserInfo: CreateAdminUserPayload): Promise<Response['CreateAdminUser']> {
  const result = await fetchAPI<'CreateAdminUser'>(apiUrl, CREATE_ADMIN_USER, adminUserInfo)
  return result
}

export async function getAdminUserById({ userId }: { userId: string }): Promise<Response['GetAdminUserById']> {
  const result = await fetchAPI<'GetAdminUserById'>(apiUrl, GET_ADMIN_USER_BY_ID, { userId: userId })
  return result
}