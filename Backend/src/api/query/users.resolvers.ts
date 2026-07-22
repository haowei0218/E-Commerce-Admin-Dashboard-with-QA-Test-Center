import { accountStatus, userLoginPayload } from "../../type/user.query.type.js";
import { getUserById, getUserByProperties, getUsers, userLogin } from "../../utils/user.utils.js";
import { ServerContext } from "../../type/user.base.type.js";



export const UsersQueryResolvers = {
  Query: {
    UserLogin: async (_parent: unknown, { account, password }: userLoginPayload, context: ServerContext) => {
      return await userLogin({ account, password }, context)
    },
    GetUsers: async (_parent: unknown, { }, context: ServerContext) => {
      return await getUsers(context)
    },
    GetUserById: async (_parent: unknown, { userId }: { userId: string }, context: ServerContext) => {
      return await getUserById(userId, context)
    },
    GetUserByProperties: async (_parent: unknown, { status, keyword, role_id }: { status: accountStatus, keyword: string, role_id: number }, context: ServerContext) => {
      return await getUserByProperties({ status, keyword, role_id }, context)
    }
  }
}