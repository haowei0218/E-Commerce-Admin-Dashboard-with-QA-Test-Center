import { filterProductPayload, getProductByIdResponse, getProductsStatisticsResponse, productPayload, updateProductDetailsPayload, updateProductDetailsResponse, updateProductStatusPayload, updateProductStatusResponse } from "@/type/products/products.base"
import { supabaseClient } from "./supabaseClient"
import { fetchAPI } from "./api-hook"
import { apiUrl } from "./utils"
import { GET_PRODUCTS, CREATE_PRODUCT, CREATE_IMAGE_TOKEN, UPDATE_PRODUCT_DETAILS, GET_PRODUCT_BY_ID, UPDATE_PRODUCT_STATUS, GET_PRODUCTS_STATISTICS } from "@/graphql/products"



export async function getProductImageUrl(imagePath: string) {
    const { data } = await supabaseClient.storage.from('products').getPublicUrl(imagePath)
    const imageUrl = data.publicUrl
    return imageUrl
}

export async function fetchProducts(payload: filterProductPayload) {
    const result = await fetchAPI<'GetProducts'>(apiUrl, GET_PRODUCTS, { input: payload })
    return result
}

export async function createProduct(payload: productPayload) {
    const result = await fetchAPI<'CreateProduct'>(apiUrl, CREATE_PRODUCT, { input: payload })
    return result
}

export async function getProductImageToken(fileName: string, contentType: string) {
    const result = await fetchAPI<'GetImageToken'>(apiUrl, CREATE_IMAGE_TOKEN, { fileName: fileName, contentType: contentType })
    return result
}
export async function uploadProductImage(imageFile: File | null) {
    if (!imageFile) return
    const { createProductImageUploadUrl } = await getProductImageToken(imageFile.name, imageFile?.type)

    console.log('path:', createProductImageUploadUrl.path)
    console.log('token exists:', !!createProductImageUploadUrl.token)
    console.log('imageFile:', imageFile)

    const fileName = `${new Date().toISOString()}_${crypto.randomUUID()}_${imageFile.name}`
    const { data, error } = await supabaseClient.storage.from('products').uploadToSignedUrl(createProductImageUploadUrl.path, createProductImageUploadUrl.token, imageFile, {
        contentType: imageFile.type
    })
    if (error) {
        throw error
    }
    return data.path
}


export async function updateProductDetails(details: updateProductDetailsPayload): Promise<updateProductDetailsResponse> {
    const result = await fetchAPI<"UpdateProductDetails">(apiUrl, UPDATE_PRODUCT_DETAILS, { input: details })
    return result
}

export async function getProductById(productId: string): Promise<getProductByIdResponse> {
    const result = await fetchAPI<'GetProductById'>(apiUrl, GET_PRODUCT_BY_ID, { productId: productId })
    return result
}

export async function updateProductStatus(input: updateProductStatusPayload): Promise<updateProductStatusResponse> {
    const result = await fetchAPI<'UpdateProductStatus'>(apiUrl, UPDATE_PRODUCT_STATUS, { input: input })
    return result
}

export async function getProductsStatistics(): Promise<getProductsStatisticsResponse> {
    const result = await fetchAPI<'GetProductsStatistics'>(apiUrl, GET_PRODUCTS_STATISTICS, {})
    return result
}