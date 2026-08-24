export type orderStatus = "pending" | "processing" | "completed" | "cancelled"
export type paymentStatus = "unpaid" | "paid" | "failed" | "refunded"
export type shippingStatus = "pending" | "preparing" | "shipped" | 'delivered' | "return"

export type orderPayload = {
    order_number: string
    customer_id: string
    recipient_name: string
    recipient_phone: string
    shipping_city: string
    shipping_district: string
    shipping_address: string
    shipping_zip_code: string
    note: string | null
    order_items: orderItems[]
}

export type orderItems = {
    order_id: string
    product_id: string
    sku: string
    product_name: string
    product_image_url: string
    purchase_quantity: number
    price: number
    total_amount: number
}

export type orderResponse = {
    id: string
    paid_at: string | null
    completed_at: string | null
    cancelled_at: string | null
    cancel_reason: string | null
    created_at: string
    updated_at: string
} & orderPayload