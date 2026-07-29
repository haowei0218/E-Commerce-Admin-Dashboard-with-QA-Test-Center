import { UserLoginResponse, GetUsersResponse, AdminUserLogoutResponse, GetAdminUserByPropertiesResponse } from './adminUser.type'

export type Response = {
  UserLogin: UserLoginResponse
  GetUsers: GetUsersResponse
  AdminUserLogout: AdminUserLogoutResponse
  GetAdminUserByProperties: GetAdminUserByPropertiesResponse
}
