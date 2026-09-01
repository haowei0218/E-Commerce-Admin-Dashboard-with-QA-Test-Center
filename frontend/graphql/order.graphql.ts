const GET_ALL_ORDERS = /* GraphQL */`
query GetAllOrders {
  getAllOrders {
    all {
      id
      order_number
      customer_id
      shipping_fee
      total_amount
      order_status
      payment_status
      shipping_status
      recipient_name
      recipient_phone
      shipping_city
      shipping_district
      shipping_address
      shipping_zip_code
      note
      paid_at
      completed_at
      cancelled_at
      cancel_reason
      created_at
      updated_at
      payment_method
      order_items {
        id
        order_id
        product_id
        sku
        product_name
        product_image_url
        purchase_quantity
        price
        total_amount
        created_at
      }
    }
  }
}
`
