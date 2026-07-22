import { accountStatus, userLoginPayload } from "../../type/user.query.type.js";
import { getAdminUserById, getAdminUserByProperties, getAdminUsers, userLogin } from "../../utils/adminUser.utils.js";
import { ServerContext } from "../../type/user.base.type.js";



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
    GetAdminUserByProperties: async (_parent: unknown, { status, keyword, role_id }: { status: accountStatus, keyword: string, role_id: number }, context: ServerContext) => {
      return await getAdminUserByProperties({ status, keyword, role_id }, context)
    }
  }
}