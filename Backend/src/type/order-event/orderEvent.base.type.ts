import { orderStatus, paymentStatus, shippingStatus } from "../orders/orders.base.js"

export type orderEvent<T extends keyof statusType> = {
    id: string
    order_id: string
    event_type: string
    prev_status: statusType[T] | null
    next_status: statusType[T] | null
    description: string
    operator_id: string
    create_at: string
}

export type orderEventResponse<T extends keyof statusType> = {
    getOrderEvent: {
        result: orderEvent<T>[]
    }
}
export type statusType = {
    order: orderStatus
    payment: paymentStatus
    shipping: shippingStatus
}

export type orderEventPayload<T extends keyof statusType> = Omit<orderEvent<T>, 'id' | 'create_at'>

export const OrderEventMap = {
    pending: "ORDER_STATUS_CREATED",
    processing: "ORDER_STATUS_PROCESSING",
    cancelled: "ORDER_STATUS_CANCELLED",
    completed: "ORDER_STATUS_COMPLETED"

}

export const OrderPaymentEventMap = {
    unpaid: "ORDER_PAYMENT_STATUS_UNPAID",
    paid: "ORDER_PAYMENT_STATUS_PAID",
    failed: "ORDER_PAYMENT_STATUS_FAILED",
    refunded: "ORDER_PAYMENT_STATUS_REFUNDED"
}

export const OrderShippingEventMap = {
    pending: "ORDER_SHIPPING_PENDING",
    preparing: "ORDER_SHIPPING_PREPARING",
    shipped: "ORDER_SHIPPING_SHIPPED",
    delivered: "ORDER_SHIPPING_DELIVERED",
    return: "ORDER_SHIPPING_RETURN"
}