import { filterProductPayload } from "@/type/products/products.base"
import { supabaseClient } from "./supabaseClient"
import { fetchAPI } from "./api-hook"
import { apiUrl } from "./utils"
import { GET_PRODUCTS } from "@/graphql/products"


export async function uploadProductImage(imageFile: File) {
    const fileName = `${new Date().toISOString()}_${crypto.randomUUID()}_${imageFile.name}`
    const { data, error } = await supabaseClient.storage.from('products').upload(fileName, imageFile)
    if (error) throw error
    return data.path
}

export async function getProductImageUrl(imagePath: string) {
    const { data } = await supabaseClient.storage.from('products').getPublicUrl(imagePath)
    const imageUrl = data.publicUrl
    return imageUrl
}

export async function fetchProducts(payload: filterProductPayload) {
    const result = await fetchAPI<'GetProducts'>(apiUrl, GET_PRODUCTS, { input: payload })
    return result
}