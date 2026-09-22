import { ServerContext } from "../../type/admin-users/adminUsers.base..js"
import { getOrderEvent } from "../../utils/order-event.js"
export const OrderEventQueryResolvers = {
    Query: {
        getOrderEvent: async (_parent: unknown, { order_id }: { order_id: string }, context: ServerContext) => {
            return await getOrderEvent(order_id, context)
        }
    }
}