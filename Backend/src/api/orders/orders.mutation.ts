import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { orderPayload } from "../../type/orders/orders.base.js";
import { createOrder } from "../../utils/orders.js";


export const OrdersMutationResolvers = {
    Mutation: {
        createOrder: async (_parent: unknown, { input }: { input: orderPayload }, context: ServerContext) => {
            return await createOrder(input, context)
        }
    }
}