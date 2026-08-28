import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { orderFilterPayload } from "../../type/orders/orders.base.js";
import { getOrders, getOrdersById } from "../../utils/orders.js";

export const OrdersQueryResolvers = {
    Query: {
        getOrders: async (_parent: unknown, { input }: { input: orderFilterPayload }, context: ServerContext) => {
            return await getOrders(input, context)
        },
        getOrdersById: async (_parent: unknown, { order_id }: { order_id: string }, context: ServerContext) => {
            return await getOrdersById(order_id, context)
        }
    }
}