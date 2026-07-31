import { UserLoginResponse, GetUsersResponse, AdminUserLogoutResponse, GetAdminUserByPropertiesResponse, CreateAdminUserResponse, GetAdminUserByIdResponse } from './adminUser.type'

export type Response = {
  UserLogin: UserLoginResponse
  GetUsers: GetUsersResponse
  AdminUserLogout: AdminUserLogoutResponse
  GetAdminUserByProperties: GetAdminUserByPropertiesResponse
  CreateAdminUser: CreateAdminUserResponse
  GetAdminUserById: GetAdminUserByIdResponse
}
