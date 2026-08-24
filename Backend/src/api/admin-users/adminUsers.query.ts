import { accountStatus, userLoginPayload } from "../../type/admin-users/adminUser.query.js";
import { getAdminUserById, getAdminUserByProperties, getAdminUsers, userLogin } from "../../utils/adminUser.js";
import { ServerContext } from "../../type/admin-users/adminUsers.base..js";



export const UsersQueryResolvers = {
  Query: {
    UserLogin: async (_parent: unknown, { account, password }: userLoginPayload, context: ServerContext) => {
      return await userLogin({ account, password }, context)
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