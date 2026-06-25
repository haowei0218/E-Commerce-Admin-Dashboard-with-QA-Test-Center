import { ServerContext } from "../../type/user.base.type.js"
import { StatusPayload, UserInformation } from "../../type/user.mutation.type.js"
import { setUserStatus, registerUser, updateUser } from "../../utils/user.utils.js"
import { createActivityLog } from "../../utils/activity-log.utils.js"
import { requestPermission } from "../../auth.js"

export const UsersMutationResolvers = {
  Mutation: {
    CreateUser: async (_parent: unknown, { name, email, password_hash, role_id, status }: UserInformation, context: ServerContext) => {
      const result = await registerUser({ name: name, email: email, password_hash: password_hash, role_id: role_id, status: status }, context)
      const { id } = result.registerUserInfo
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'CREATE', description: `新增了一名使用者${name}` }, context)
      }
      return result
    },
    UpdateUserProfile: async (_parent: unknown, { id, name, email, password_hash }: Omit<UserInformation, 'role_id' | 'status'>, context: ServerContext) => {
      const result = await updateUser({ id: id, name: name, email: email, password_hash: password_hash }, context)
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `更新了使用者${name}的資料` }, context)
      }
      return {
        userInfo: result.updateUserInfo
      }
    },
    DeActiveUser: async (_parent: unknown, { id, status = 'inactive' }: StatusPayload, context: ServerContext) => {
      const canMangeUser = await requestPermission(id, context)

      if (canMangeUser) {
        const result = await setUserStatus({ id: id, status: status }, context)
        if (result) {
          await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `已將一名使用者${result.setUserStatus.name} 加入黑名單` }, context)
        }
        return {
          userInfo: result.setUserStatus
        }
      }
    },
    ActiveUser: async (_parent: unknown, { id, status = 'active' }: StatusPayload, context: ServerContext) => {
      const result = await setUserStatus({ id: id, status: status }, context)
      if (result) {
        await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `已將一名使用者${result.setUserStatus.name} 加入白名單` }, context)
      }
      return {
        userInfo: result.setUserStatus
      }
    }
  }
}