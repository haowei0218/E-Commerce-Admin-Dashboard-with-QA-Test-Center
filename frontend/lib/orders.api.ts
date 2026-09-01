import { fetchAPI } from "./api-hook";

const apiUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:4201/graphql'

export async function getAllOrders() {
    const result = await fetchAPI(apiUrl, GET_ALL_ORDERS)
    return result
}