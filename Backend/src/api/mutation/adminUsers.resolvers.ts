import { ServerContext } from "../../type/user.base.type.js"
import { changePasswordPayload, StatusPayload, UserInformation, updateMyProfilePayload } from "../../type/user.mutation.type.js"
import { setAdminUserStatus, createAdminUser, updateAdminUser, adminUserLogout, updateProfile, changePassword, updateMyProfile, setAdminUserRole } from "../../utils/adminUser.utils.js"
import { createActivityLog } from "../../utils/activity-log.utils.js"
import { requestPermission } from "../../auth.js"
import { userInfo } from "node:os"

export const UsersMutationResolvers = {
  Mutation: {
    CreateAdminUser: async (_parent: unknown, { name, email, password_hash, role_id, status }: UserInformation, context: ServerContext) => {
      const result = await createAdminUser({ name: name, email: email, password_hash: password_hash, role_id: role_id, status: status }, context)
      const { id } = result.userInfo
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'CREATE', description: `新增了一名使用者${name}` }, context)
      }
      return result
    },
    UpdateAdminUserProfile: async (_parent: unknown, { id, name, email, password_hash, role_id, status }: UserInformation, context: ServerContext) => {
      const result = await updateAdminUser({ id: id, name: name, email: email, password_hash: password_hash, role_id, status }, context)
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `更新了使用者${name}的資料` }, context)
      }
      return {
        userInfo: result.updateUserInfo
      }
    },
    UpdateProfile: async (_parent: unknown, { id, name, email, password_hash, status }: Omit<UserInformation, 'role_id'>, context: ServerContext) => {
      const result = await updateProfile({ id: id, name: name, email: email, password_hash: password_hash, status: status }, context)
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `更新了使用者${name}的資料` }, context)
      }
      return {
        userInfo: result.updateUserInfo
      }
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
      return await changePassword(id, newPassword, context)
    },
    UpdateMyProfile: async (_parent: unknown, { id, name, email }: updateMyProfilePayload, context: ServerContext) => {
      return await updateMyProfile({ id, name, email }, context)
    },
    SetAdminUserRole: async (_parent: unknown, { id, role_id }: Omit<UserInformation, "name" | "email" | "password_hash" | "status">, context: ServerContext) => {
      return await setAdminUserRole(id, role_id, context)
    }
  }
}