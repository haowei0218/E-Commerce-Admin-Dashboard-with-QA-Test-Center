import { UserLoginResponse, GetUsersResponse,AdminUserLogoutResponse } from './user.login.type'

export type Response = {
  UserLogin: UserLoginResponse
  GetUsers: GetUsersResponse
  AdminUserLogout:AdminUserLogoutResponse
}
