import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { orderFilterPayload } from "../../type/orders/orders.base.js";
import { getOrders, getOrderById, getAllOrders, getOrdersStatistics } from "../../utils/orders.js";

export const OrdersQueryResolvers = {
    Query: {
        getOrders: async (_parent: unknown, { input }: { input: orderFilterPayload }, context: ServerContext) => {
            return await getOrders(input, context)
        },
        getOrderById: async (_parent: unknown, { id }: { id: string }, context: ServerContext) => {
            return await getOrderById(id, context)
        },
        getAllOrders: async (_parent: unknown, { }, context: ServerContext) => {
            return await getAllOrders(context)
        },
        getOrdersStatistics: async (_parent: unknown, { }, context: ServerContext) => {
            return await getOrdersStatistics(context)
        }
    }
}