export interface Role {
  id: number
  code: string
  role_name: string
}

export type UserLoginPayload = {
  account: string
  password: string
}

export type loginUserProfile = {
  id: string
  name: string
  email: string
  role_id: number
  status: string
}
export type adminUserProfile = {
  id: string
  name: string
  email: string
  code: string
  status: 'Active' | 'Inactive'
  create_at: string
}

export type UserLoginResponse = {
  UserLogin: {
    userProfile: loginUserProfile
    token: string
  }
}

export type GetUsersResponse = {
  GetAdminUsers: {
    getUsers: adminUserProfile[]
  }
}

export type AdminUserLogoutResponse = {
  AdminUserLogout: {
    success: boolean,
    message: string
  }
}

export type GetAdminUserByPropertiesResponse = {
  GetAdminUserByProperties: {
    getUsers: adminUserProfile[]
  }
}

export type GetAdminUserByPropertiesPayload = {
  keyword: string | null
  roleId: number | string | null
  status: string | null
}