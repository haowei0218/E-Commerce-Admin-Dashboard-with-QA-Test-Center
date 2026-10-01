export const GET_PRODUCTS = /* GraphQL */`
query GetProducts($input: filterProductsPayload) {
  getProducts(input: $input) {
    result {
      id
      product_name
      product_description
      product_image_url
      product_sku
      product_price
      color
      stock_quantity
      status
      created_at
      updated_at
    }
    total_count
    page
    pageSize
  }
}
`