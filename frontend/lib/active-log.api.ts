import { GET_ACTIVE_LOG } from "@/graphql/acitve-log";
import { fetchAPI } from "./api-hook";


const apiUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:4201/graphql'
export async function getActiveLog(userId: string) {
    const result = await fetchAPI<"GetActiveLog">(apiUrl, GET_ACTIVE_LOG, { userId: userId })
    return result
}