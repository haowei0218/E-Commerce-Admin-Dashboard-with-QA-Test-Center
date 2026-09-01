import { USER_LOGIN, GET_USERS, ADMIN_USER_LOGOUT, GET_ADMIN_USER_BY_PROPERTIES, CREATE_ADMIN_USER, GET_ADMIN_USER_BY_ID, UPDATE_MY_PROFILE, CHANGE_PASSWORD, SET_ADMIN_USER_ROLE, SET_ADMIN_USER_ACTIVE } from '@/graphql/user.graphql'
import { Response } from '@/type/api.response.type'
import { CreateAdminUserPayload, GetAdminUserByPropertiesPayload, UserLoginPayload } from '@/type/admin-users/adminUser.type'
import { fetchAPI } from '@/lib/api-hook'

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

export async function updateMyProfile({ updateMyProfileId, name, email }: { updateMyProfileId: string, name: string, email: string }): Promise<Response['UpdateMyProfile']> {
  const result = await fetchAPI<'UpdateMyProfile'>(apiUrl, UPDATE_MY_PROFILE, { updateMyProfileId: updateMyProfileId, name: name, email: email })
  return result
}

export async function changePassword({ changePasswordId, newPassword }: { changePasswordId: string, newPassword: string }): Promise<Response['ChangePassword']> {
  const result = await fetchAPI<'ChangePassword'>(apiUrl, CHANGE_PASSWORD, { changePasswordId: changePasswordId, newPassword: newPassword })
  return result
}

export async function setAdminUserRole({ setAdminUserRoleId, roleId }: { setAdminUserRoleId: string, roleId: number }): Promise<Response['SetAdminUserRole']> {
  const result = await fetchAPI<'SetAdminUserRole'>(apiUrl, SET_ADMIN_USER_ROLE, { setAdminUserRoleId: setAdminUserRoleId, roleId: roleId })
  return result
}

export async function setAdminUserActive({ setAdminUserActiveId, status }: { setAdminUserActiveId: string, status: string }): Promise<Response['SetAdminUserActive']> {
  if (!setAdminUserActiveId || setAdminUserActiveId.length === 0 || status.length === 0) {
    throw new Error('Invalid input data')
  }
  const result = await fetchAPI<'SetAdminUserActive'>(apiUrl, SET_ADMIN_USER_ACTIVE, { setAdminUserActiveId: setAdminUserActiveId, status: status })
  return result
}