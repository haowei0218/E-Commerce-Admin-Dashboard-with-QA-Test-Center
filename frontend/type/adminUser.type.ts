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
  create_at?: string
  manage_level?: number
  permissions?: string[]
  last_login_at: string
  update_at: string
}
export type adminUserProfile = {
  id: string
  name: string
  email: string
  code: string
  status: 'Active' | 'Inactive'
  create_at: string
  last_login_at: string
  update_at: string
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

export type CreateAdminUserPayload = {
  name: string
  email: string
  roleId: number
  status: string
  passwordHash: string
}

export type CreateAdminUserResponse = {
  CreateAdminUser: {
    userInfo: loginUserProfile
  }
}

export type GetAdminUserByIdResponse = {
  GetAdminUserById: {
    getUserById: loginUserProfile
  }
}

export type UpdateMyProfileResponse = {
  UpdateMyProfile: {
    userProfile: adminUserProfile
  }
}

export type ChangePasswordResponse = {
  ChangePassword: {
    userProfile: loginUserProfile
  }
}

export type SetAdminUserRoleResponse = {
  SetAdminUserRole: {
    userProfile: adminUserProfile
  }
}

export type SetAdminUserInactiveResponse = {
  SetAdminUserInactive: {
    userInfo: loginUserProfile
  }
}

export type SetAdminUserActiveResponse = {
  SetAdminUserActive: {
    userInfo: loginUserProfile
  }
}
export type RoleMap = {
  1: "Admin",
  2: "Manager",
  3: "Staff",
  4: "Viewer",
  5: "QA",
  6: "Developer"
}

export type RoleCode = keyof RoleMap