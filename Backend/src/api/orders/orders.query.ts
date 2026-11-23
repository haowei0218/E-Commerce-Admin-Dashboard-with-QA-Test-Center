import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { orderFilterPayload } from "../../type/orders/orders.base.js";
import { fetchOrders, fetchOrderById, fetchAllOrders, fetchOrdersStatistics } from "../../utils/orders.js";

export const OrdersQueryResolvers = {
    Query: {
        getOrders: async (_parent: unknown, { input }: { input: orderFilterPayload }, context: ServerContext) => {
            return await fetchOrders(input, context)
        },
        getOrderById: async (_parent: unknown, { id }: { id: string }, context: ServerContext) => {
            return await fetchOrderById(id, context)
        },
        getAllOrders: async (_parent: unknown, { }, context: ServerContext) => {
            return await fetchAllOrders(context)
        },
        getOrdersStatistics: async (_parent: unknown, { }, context: ServerContext) => {
            return await fetchOrdersStatistics(context)
        }
    }
}