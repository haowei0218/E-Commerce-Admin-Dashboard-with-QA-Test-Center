import { create } from "node:domain";
import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { orderPayload, updateOrderNotePayload, updateOrderRecipientPayload, updateOrderStatusPayload, updatePaymentStatusPayload, updateShippingStatusPayload } from "../../type/orders/orders.base.js";
import { createActivityLog } from "../../utils/activity-log.js";
import { createOrder, updateOrderRecipient, updateOrderStatus, updatePaymentStatus, updateShippingStatus, updateOrderNote, getOrderById } from "../../utils/orders.js";
import { createOrderEvent } from "../../utils/order-event.js";
import { OrderEventMap, OrderPaymentEventMap, OrderShippingEventMap } from "../../type/order-event/orderEvent.base.type.js";

export const OrdersMutationResolvers = {
    Mutation: {
        createOrder: async (_parent: unknown, { input }: { input: orderPayload }, context: ServerContext) => {
            const result = await createOrder(input, context)
            if (result) {
                await createActivityLog({ user_id: context.user.id, action: 'CREATE', description: `使用者${context.user.name} 新增了一筆訂單${input.order_number}`, module: "orders" }, context)
                await createOrderEvent({
                    order_id: result.details.id,
                    event_type: OrderEventMap['pending'],
                    prev_status: null,
                    next_status: null,
                    description: `Order has been created successfully. orderId:${result.details.id}`,
                    operator_id: context.user.id
                }, context)
            }
            return result
        },
        updateOrderStatus: async (_parent: unknown, { input }: { input: updateOrderStatusPayload }, context: ServerContext) => {
            try {
                const order = await getOrderById(input.id, context)
                const prev_status = order.result.order_status ?? null
                const result = await updateOrderStatus(input, context)
                if (result) {
                    await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `使用者${context.user.name} 更改訂單狀態為${input.order_status} 訂單編號:${input.id}`, module: 'orders' }, context)
                    await createOrderEvent({
                        order_id: input.id,
                        event_type: OrderEventMap[input.order_status],
                        prev_status: prev_status,
                        next_status: input.order_status,
                        description: `Order status changed from ${prev_status} to ${input.order_status}`,
                        operator_id: context.user.id
                    }, context)
                }
                return result
            } catch (error) {
                throw error
            }

        },
        updatePaymentStatus: async (_parent: unknown, { input }: { input: updatePaymentStatusPayload }, context: ServerContext) => {
            try {
                const order = await getOrderById(input.id, context)
                const prev_status = order.result.payment_status ?? null
                const result = await updatePaymentStatus(input, context)
                if (result) {
                    await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `使用者${context.user.name} 更改訂單付款狀態為${input.payment_status} 訂單編號:${input.id}`, module: 'orders' }, context)
                    await createOrderEvent({
                        order_id: input.id,
                        event_type: OrderPaymentEventMap[input.payment_status],
                        prev_status: prev_status,
                        next_status: input.payment_status,
                        description: `Payment status changed from ${prev_status} to ${input.payment_status}`,
                        operator_id: context.user.id
                    }, context)
                }
                return result
            } catch (error) {
                throw error
            }

        },
        updateShippingStatus: async (_parent: unknown, { input }: { input: updateShippingStatusPayload }, context: ServerContext) => {
            try {
                const order = await getOrderById(input.id, context)
                const prev_status = order.result.shipping_status ?? null
                const result = await updateShippingStatus(input, context)
                if (result) {
                    await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `使用者${context.user.name} 更改訂單物流狀態為${input.shipping_status} 訂單編號:${input.id}`, module: 'orders' }, context)
                    await createOrderEvent({
                        order_id: input.id,
                        event_type: OrderShippingEventMap[input.shipping_status],
                        prev_status: prev_status,
                        next_status: input.shipping_status,
                        description: `Shipping status changed from ${prev_status} to ${input.shipping_status}`,
                        operator_id: context.user.id
                    }, context)
                }
                return result
            } catch (error) {
                throw error
            }

        },
        updateOrderRecipient: async (_parent: unknown, { input }: { input: updateOrderRecipientPayload }, context: ServerContext) => {
            const result = await updateOrderRecipient(input, context)
            const recipient = [input.shipping_address ?? "", input.shipping_city ?? "", input.shipping_district ?? ""].join(',')
            if (result) await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `使用者${context.user.name} 更改收件地址為${recipient} 訂單編號:${input.id}`, module: 'orders' }, context)
            return result
        },
        updateOrderNote: async (_parent: unknown, { input }: { input: updateOrderNotePayload }, context: ServerContext) => {
            const result = await updateOrderNote(input, context)
            if (result) await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `使用者${context.user.name} 更改訂單備註 訂單編號:${input.id}`, module: 'orders' }, context)
            return result
        }
    }
}