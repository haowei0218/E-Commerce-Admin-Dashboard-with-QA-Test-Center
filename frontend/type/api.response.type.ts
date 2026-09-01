import { UserLoginResponse, GetUsersResponse, AdminUserLogoutResponse, GetAdminUserByPropertiesResponse, CreateAdminUserResponse, GetAdminUserByIdResponse, UpdateMyProfileResponse, ChangePasswordResponse, SetAdminUserRoleResponse, SetAdminUserActiveResponse, SetAdminUserInactiveResponse } from './admin-users/adminUser.type'

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
  SetAdminUserActive: SetAdminUserActiveResponse
  SetAdminUserInactive: SetAdminUserInactiveResponse
}
