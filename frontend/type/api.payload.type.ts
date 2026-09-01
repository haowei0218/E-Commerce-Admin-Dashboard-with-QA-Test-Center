import { adminUserProfile, CreateAdminUserPayload, GetAdminUserByPropertiesPayload, UserLoginPayload } from './admin-users/adminUser.type'

export type APIPayload = {
  UserLogin: UserLoginPayload
  GetUsers: null,
  AdminUserLogout: null
  GetAdminUserByProperties: GetAdminUserByPropertiesPayload
  CreateAdminUser: CreateAdminUserPayload
  GetAdminUserById: { userId: string }
  UpdateMyProfile: Pick<adminUserProfile, "email" | "name"> & { updateMyProfileId: string }
  ChangePassword: { changePasswordId: string, newPassword: string }
  SetAdminUserRole: { setAdminUserRoleId: string, roleId: number }
  SetAdminUserActive: { setAdminUserActiveId: string, status: string }
  SetAdminUserInactive: { setAdminUserInactiveId: string, status: string }
}
