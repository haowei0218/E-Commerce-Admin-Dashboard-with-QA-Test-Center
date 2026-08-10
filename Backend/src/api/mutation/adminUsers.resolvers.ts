import { ServerContext } from "../../type/user.base.type.js"
import { changePasswordPayload, StatusPayload, UserInformation, updateMyProfilePayload } from "../../type/user.mutation.type.js"
import { setAdminUserStatus, createAdminUser, adminUserLogout, changePassword, updateMyProfile, setAdminUserRole } from "../../utils/adminUser.utils.js"
import { createActivityLog } from "../../utils/activity-log.utils.js"
import { requestPermission } from "../../auth.js"
import { userInfo } from "node:os"

export const UsersMutationResolvers = {
  Mutation: {
    CreateAdminUser: async (_parent: unknown, { name, email, password_hash, role_id, status }: UserInformation, context: ServerContext) => {
      const result = await createAdminUser({ name: name, email: email, password_hash: password_hash, role_id: role_id, status: status }, context)
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'CREATE', description: `新增了一名使用者${name}` }, context)
      }
      return result
    },
    SetAdminUserInactive: async (_parent: unknown, { id, status = 'inactive' }: StatusPayload, context: ServerContext) => {
      const canMangeUser = await requestPermission(id, context)
      if (canMangeUser) {
        const result = await setAdminUserStatus({ id: id, status: status }, context)
        if (result) {
          await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `已將一名使用者${result.setUserStatus.name} 加入黑名單` }, context)
        }
        return {
          userInfo: result.setUserStatus
        }
      }
    },
    SetAdminUserActive: async (_parent: unknown, { id, status = 'active' }: StatusPayload, context: ServerContext) => {
      const result = await setAdminUserStatus({ id: id, status: status }, context)
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `已將一名使用者${result.setUserStatus.name} 加入白名單` }, context)
      }
      return {
        userInfo: result.setUserStatus
      }
    },
    AdminUserLogout: async (_parent: unknown, _args: unknown, context: ServerContext) => {
      return await adminUserLogout(context)
    },
    ChangePassword: async (_parent: unknown, { id, newPassword }: changePasswordPayload, context: ServerContext) => {
      const result = await changePassword(id, newPassword, context)
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `已更改使用者${result.userProfile.name}的密碼` }, context)
      }
      return {
        userProfile: result.userProfile
      }
    },
    UpdateMyProfile: async (_parent: unknown, { id, name, email }: updateMyProfilePayload, context: ServerContext) => {
      const result = await updateMyProfile({ id, name, email }, context)
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `已更改使用者${result.userProfile.name}的基礎資料` }, context)
      }
      return {
        userProfile: result.userProfile
      }
    },
    SetAdminUserRole: async (_parent: unknown, { id, role_id }: Omit<UserInformation, "name" | "email" | "password_hash" | "status">, context: ServerContext) => {
      const result = await setAdminUserRole(id, role_id, context)
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `已更改使用者${result.userProfile.name}的帳號權限` }, context)
      }
      return {
        userProfile: result.userProfile
      }
    }
  }
}