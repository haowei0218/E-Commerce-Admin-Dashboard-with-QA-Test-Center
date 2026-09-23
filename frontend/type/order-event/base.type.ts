import { orderStatus, paymentStatus, shippingStatus } from "../orders/base.type"

export type orderEvent<> = {
    id: string
    order_id: string
    event_type: string
    prev_status: string | null
    next_status: string | null
    description: string
    operator_id: string
    created_at: string
}

export type orderEventResponse = {
    getOrderEvent: {
        result: orderEvent[]
    }
}
export type statusType = {
    order: orderStatus
    payment: paymentStatus
    shipping: shippingStatus
}

export type orderEventPayload = Omit<orderEvent, 'id' | 'create_at'>