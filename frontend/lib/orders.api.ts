import { getAllOrdersResponse, getOrderByIdResponse, getOrdersResponse, orderFilterPayload, orderStatus, updateOrderNotePayload, updateOrderNoteResponse, updateOrderStatusPayload, updateOrderStatusResponse, updatePaymentStatusPayload, updatePaymentStatusResponse, updateShippingStatusPayload, updateShippingStatusResponse } from "@/type/orders/base.type";
import { fetchAPI } from "./api-hook";
import { GET_ALL_ORDERS, GET_ORDERS, GET_ORDERS_BY_ID, UPDATE_ORDER_NOTE, UPDATE_ORDER_STATUS, UPDATE_PAYMENT_STATUS, UPDATE_SHIPPING_STATUS } from "@/graphql/order.graphql";
const apiUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:4201/graphql'

export async function getAllOrders(): Promise<getAllOrdersResponse> {
    const result = await fetchAPI<'GetAllOrders'>(apiUrl, GET_ALL_ORDERS)
    return result
}

export async function getOrders(payload: orderFilterPayload): Promise<getOrdersResponse> {
    const result = await fetchAPI<'GetOrders'>(apiUrl, GET_ORDERS, { input: payload })
    return result
}

export async function getOrderById(orderId: string): Promise<getOrderByIdResponse> {
    const result = await fetchAPI<'GetOrderById'>(apiUrl, GET_ORDERS_BY_ID, { orderId: orderId })
    return result
}

export async function updateOrderStatus(payload: updateOrderStatusPayload): Promise<updateOrderStatusResponse> {
    const result = await fetchAPI<'UpdateOrderStatus'>(apiUrl, UPDATE_ORDER_STATUS, { input: payload })
    return result
}

export async function updatePaymentStatus(payload: updatePaymentStatusPayload): Promise<updatePaymentStatusResponse> {
    const result = await fetchAPI<'UpdatePaymentStatus'>(apiUrl, UPDATE_PAYMENT_STATUS, { input: payload })
    return result
}

export async function updateShippingStatus(payload: updateShippingStatusPayload): Promise<updateShippingStatusResponse> {
    const result = await fetchAPI<'UpdateShippingStatus'>(apiUrl, UPDATE_SHIPPING_STATUS, { input: payload })
    return result
}

export async function updateOrderNote(payload: updateOrderNotePayload): Promise<updateOrderNoteResponse> {
    const result = await fetchAPI<'UpdateOrderNote'>(apiUrl, UPDATE_ORDER_NOTE, { input: payload })
    return result
}
