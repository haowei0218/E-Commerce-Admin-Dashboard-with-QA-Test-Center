import { stat } from "node:fs"
import { ServerContext } from "../../../type/user.base.type.js"
import { UserInformation } from "../../../type/user.mutation.type.js"
import { registerUser } from "../../../utils/user.utils.js"
export const MutationResolvers = {
  Mutation: {
    RegisterUser: async (_parent: unknown, { name, email, password_hash, role_id, status }: UserInformation, context: ServerContext) => {
      try {
        const result = await registerUser({ name: name, email: email, password_hash: password_hash, role_id: role_id, status: status }, context)
        return result
      } catch { }
    }
  }
}