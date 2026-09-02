import { UserLoginResponse, GetUsersResponse, AdminUserLogoutResponse, GetAdminUserByPropertiesResponse, CreateAdminUserResponse, GetAdminUserByIdResponse, UpdateMyProfileResponse, ChangePasswordResponse, SetAdminUserRoleResponse, SetAdminUserActiveResponse, SetAdminUserInactiveResponse } from './admin-users/adminUser.type'
import { getAllOrdersResponse, getOrdersResponse } from './orders/base.type'

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
  GetAllOrders: getAllOrdersResponse
  GetOrders:getOrdersResponse
}
