import { GET_ORDER_EVENT } from "@/graphql/order-event.graphql"
import { fetchAPI } from "./api-hook"
import { orderEventResponse, statusType } from "@/type/order-event/base.type"

const apiUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:4201/graphql'
export async function getOrderEvent(orderId: string): Promise<orderEventResponse> {
    const result = await fetchAPI<'GetOrderEvent'>(apiUrl, GET_ORDER_EVENT, { orderId: orderId })
    return result 
}