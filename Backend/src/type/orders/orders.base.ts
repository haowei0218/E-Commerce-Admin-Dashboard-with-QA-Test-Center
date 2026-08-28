export type orderStatus = "pending" | "processing" | "completed" | "cancelled"
export type paymentStatus = "unpaid" | "paid" | "failed" | "refunded"
export type shippingStatus = "pending" | "preparing" | "shipped" | 'delivered' | "return"
export type paymentMethod = "bank_transfer" | "credit_card" | "cash_on_delivery"
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
    payment_method: paymentMethod
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

export type order = {
    id: string
    paid_at: string | null
    completed_at: string | null
    cancelled_at: string | null
    cancel_reason: string | null
    created_at: string
    updated_at: string
} & orderPayload

export type orderResponse = {
    details: order
}

export type updateOrderStatusPayload = {
    id: string
    order_status: orderStatus
    cancel_reason: string | null
}

export type updateOrderStatusResponse = {
    updateDetails: order
}

export type updatePaymentStatusPayload = {
    id: string
    payment_status: paymentStatus
}

export type updatePaymentStatusResponse = {
    updatePaymentDetails: order
}

export type getOrderStatusResposne = {
    id: string
    payment_status: paymentStatus
    order_status: orderStatus
    shipping_status: shippingStatus
}

export type updateShippingStatusPayload = {
    id: string
    shipping_status: shippingStatus
}

export type updateShippingStatusResponse = {
    updateShippingDetails: order
}

export type updateOrderRecipientPayload = {
    id: string
    recipient_name: string
    recipient_phone: string
    shipping_city: string
    shipping_district: string
    shipping_address: string
    shipping_zip_code: string
}

export type updateOrderRecipientResponse = {
    updateOrderRecipientDetails: order
}

export type getOrdersResponse = {
    getOrders: order
}

export type orderFilterPayload = {
    keyword?: string
    order_status?: string
    payment_status?: string
    shipping_status?: string
    date_from?: string
    date_to?: string
    page: number
    pageSize: number
}

export const orderStatusTransitions: Record<string, string[]> = {
    pending: ["processing", "cancelled"],
    processing: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

export const paymentStatusTransitions: Record<string, string[]> = {
    unpaid: ["paid", "failed"],
    failed: ["unpaid", "paid"],
    paid: ["refunded"],
    refunded: [],
};

export const shippingStatusTransitions: Record<string, string[]> = {
    pending: ['preparing'],
    preparing: ['shipped'],
    shipped: ['delivered'],
    delivered: ['return'],
    return: []
}