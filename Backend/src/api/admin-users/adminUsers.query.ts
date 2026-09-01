import { accountStatus, userLoginPayload } from "../../type/admin-users/adminUser.query.js";
import { getAdminUserById, getAdminUserByProperties, getAdminUsers, userLogin } from "../../utils/adminUser.js";
import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { createActivityLog } from "../../utils/activity-log.js";
import { updateUserLoginAt } from "../../utils/adminUser.js";


export const UsersQueryResolvers = {
  Query: {
    UserLogin: async (_parent: unknown, { account, password }: userLoginPayload, context: ServerContext) => {
      const result = await userLogin({ account, password }, context)
      if (result) {
        await updateUserLoginAt(result.userProfile.id, context)
        await createActivityLog({ user_id: result.userProfile.id, action: 'READ', description: `使用者${result.userProfile.email}登入 id:${result.userProfile.id} last_login_at:${new Date().toISOString()}`, module: 'login' }, context)
      }
      return result
    },
    GetAdminUsers: async (_parent: unknown, { }, context: ServerContext) => {
      return await getAdminUsers(context)
    },
    GetAdminUserById: async (_parent: unknown, { userId }: { userId: string }, context: ServerContext) => {
      return await getAdminUserById(userId, context)
    },
    GetAdminUserByProperties: async (_parent: unknown, { keyword, role_id, status }: { keyword: string, role_id: number, status: accountStatus, }, context: ServerContext) => {
      return await getAdminUserByProperties({ keyword, role_id, status }, context)
    }
  }
}