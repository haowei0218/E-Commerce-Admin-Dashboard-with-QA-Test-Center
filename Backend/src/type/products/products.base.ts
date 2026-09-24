export type productStatus = 'draft' | 'published' | 'unpublished' | 'archived'
export type product = {
    id: string
    product_name: string
    product_description: string
    product_image_url: string
    product_sku: string
    product_price: string
    color: string
    stock_quantity: number
    status: productStatus
    created_at: string
    updated_at: string
}
export type productPayload = Omit<product, 'id' | 'created_at' | 'updated_at'>
export type filterProductPayload = {
    keywords?: string | null
    status?: productStatus | null
    price?: number | null
    page: number
    pageSize: number 
}
export type getProductsResponse = {
    result: product[]
    total_count: number
    page: number
    pageSize: number
}

export type updateProductDetailsPayload = productPayload & { id: string }
export type updateProductStatusPayload = {
    id: string
    status: productStatus
}
export type productResponse = { result: product }