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

export const CREATE_PRODUCT = /* GraphQL */`
mutation CreateProduct($input: productPayload) {
  createProduct(input: $input) {
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
  }
}
`

export const CREATE_IMAGE_TOKEN = /* GraphQL */`
mutation CreateProductImageUploadUrl($fileName: String!, $contentType: String!) {
  createProductImageUploadUrl(fileName: $fileName, contentType: $contentType) {
    path
    token
  }
}
`