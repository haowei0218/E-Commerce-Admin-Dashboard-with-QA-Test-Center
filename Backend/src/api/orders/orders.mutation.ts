import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { orderPayload, updateOrderStatusPayload, updatePaymentStatusPayload, updateShippingStatusPayload } from "../../type/orders/orders.base.js";
import { createActivityLog } from "../../utils/activity-log.js";
import { createOrder, updateOrderStatus, updatePaymentStatus, updateShippingStatus } from "../../utils/orders.js";


export const OrdersMutationResolvers = {
    Mutation: {
        createOrder: async (_parent: unknown, { input }: { input: orderPayload }, context: ServerContext) => {
            const result = await createOrder(input, context)
            if (result) await createActivityLog({ user_id: context.user.id, action: 'CREATE', description: `使用者${context.user.name} 新增了一筆訂單${input.order_number}`, module: "orders" }, context)
            return result
        },
        updateOrderStatus: async (_parent: unknown, { input }: { input: updateOrderStatusPayload }, context: ServerContext) => {
            const result = await updateOrderStatus(input, context)
            if (result) await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `使用者${context.user.name} 更改訂單狀態為${input.order_status} 訂單編號:${input.id}`, module: 'orders' }, context)
            return result
        },
        updatePaymentStatus: async (_parent: unknown, { input }: { input: updatePaymentStatusPayload }, context: ServerContext) => {
            const result = await updatePaymentStatus(input, context)
            if (result) await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `使用者${context.user.name} 更改訂單付款狀態為${input.payment_status} 訂單編號:${input.id}`, module: 'orders' }, context)
            return result
        },
        updateShippingStatus: async (_parent: unknown, { input }: { input: updateShippingStatusPayload }, context: ServerContext) => {
            const result = await updateShippingStatus(input, context)
            if (result) await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `使用者${context.user.name} 更改訂單物流狀態為${input.shipping_status} 訂單編號:${input.id}`, module: 'orders' }, context)
            return result
        }
    }
}