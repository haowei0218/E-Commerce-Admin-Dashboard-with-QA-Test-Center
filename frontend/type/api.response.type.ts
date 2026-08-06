import { UserLoginResponse, GetUsersResponse, AdminUserLogoutResponse, GetAdminUserByPropertiesResponse, CreateAdminUserResponse, GetAdminUserByIdResponse, UpdateMyProfileResponse, ChangePasswordResponse, SetAdminUserRoleResponse } from './adminUser.type'

export type Response = {
  UserLogin: UserLoginResponse
  GetUsers: GetUsersResponse
  AdminUserLogout: AdminUserLogoutResponse
  GetAdminUserByProperties: GetAdminUserByPropertiesResponse
  CreateAdminUser: CreateAdminUserResponse
  GetAdminUserById: GetAdminUserByIdResponse
  UpdateMyProfile: UpdateMyProfileResponse
  ChangePassword: ChangePasswordResponse
  SetAdminUserRole: SetAdminUserRoleResponse
}
