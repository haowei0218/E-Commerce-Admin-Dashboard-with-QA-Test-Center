import { getAllOrdersResponse, getOrdersResponse, orderFilterPayload } from "@/type/orders/base.type";
import { fetchAPI } from "./api-hook";
import { GET_ALL_ORDERS, GET_ORDERS } from "@/graphql/order.graphql";
const apiUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:4201/graphql'

export async function getAllOrders(): Promise<getAllOrdersResponse> {
    const result = await fetchAPI<'GetAllOrders'>(apiUrl, GET_ALL_ORDERS)
    return result
}

export async function getOrders(payload: orderFilterPayload): Promise<getOrdersResponse> {
    const result = await fetchAPI<'GetOrders'>(apiUrl, GET_ORDERS, { input: payload })
    return result
}   