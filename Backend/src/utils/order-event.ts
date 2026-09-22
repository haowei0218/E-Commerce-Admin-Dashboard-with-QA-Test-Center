import { ServerContext } from "../type/admin-users/adminUsers.base..js";
import { orderEventPayload, orderEventResponse, statusType } from "../type/order-event/orderEvent.base.type.js";

export async function getOrderEvent(orderId: string, context: ServerContext) {
    const response = await context.db.query('select * from order_events where order_id=$1 ORDER BY created_at ASC', [orderId])
    const orderEvent = response.rows ?? []
    return { result: orderEvent }
}

export async function createOrderEvent<T extends keyof statusType>(payload: orderEventPayload<T>, context: ServerContext) {
    const result = await context.db.query('insert into order_events (order_id,event_type,prev_status,next_status,description,operator_id) values($1,$2,$3,$4,$5,$6)', [payload.order_id, payload.event_type, payload.prev_status, payload.next_status, payload.description, context.user.id])
    const orderEvent = result.rows
    return orderEvent
}