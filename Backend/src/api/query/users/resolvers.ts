import { userLoginPayload } from "../../../type/user.query.type.js";
import { userLogin } from "../../../utils/user.utils.js";
import { ServerContext } from "../../../type/user.base.type.js";


export const QueryResolvers = {
  Query: {
    UserLogin: async (_parent: unknown, { account, password }: userLoginPayload, context: ServerContext) => {
      return await userLogin({ account, password }, context)
    },
  }
}