import { GetAdminUserByPropertiesPayload, UserLoginPayload } from './adminUser.type'

export type APIPayload = {
  UserLogin: UserLoginPayload
  GetUsers: null,
  AdminUserLogout: null
  GetAdminUserByProperties: GetAdminUserByPropertiesPayload
}
