import { mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from 'graphql-tag'

export const product = gql`
    type product{
        id:String
        product_name:String
        product_description:String
        product_image_url:String
        product_sku:String
        product_price:Int
        color:String
        stock_quantity:Int
        status:String
        created_at:String
        updated_at:String
    }
`

export const productPayload = gql`
    input productPayload{
        product_name:String
        product_description:String
        product_image_url:String
        product_sku:String
        product_price:Int
        color:String
        stock_quantity:Int
        status:String
    }
`

// keywords : id , name , sku
export const filterProductsPayload = gql`
    input filterProductsPayload{
        keywords:String
        status:String
        price:Int
        page:Int
        pageSize:Int
    }
`

export const getProductsResponse = gql`
    type getProductsResponse{
        result:[product]
        total_count:Int
        page:Int
        pageSize:Int
    }
`

export const createProductResponse = gql`
    type createProductResponse{
        result:product
    }
`

export const productResponse = gql`
    type productResponse{
        result:product
    }


`

export const updateProductDetailsPayload = gql`
    input updateProductDetailsPayload{
        id:String
        product_name:String
        product_description:String
        product_image_url:String
        product_sku:String
        product_price:Int
        stock_quantity:Int
        status:String
    }
`

export const updateProductDetailsResponse = gql`
    type updateProductDetailsResponse {
        result:product
    }
`

export const updateProductStatusPayload = gql`
    input updateProductStatusPayload{
        id:String
        status:String
    }
`
export const updateProductStatusResponse = gql`
    type updateProductStatusResponse{
        result:product
    }
`

export const deleteProductResponse = gql`
    type deleteProductResponse{
        result:product
    }
`


export const mergeProductTypeDefs = mergeTypeDefs([product, productPayload, filterProductsPayload, getProductsResponse, createProductResponse, updateProductDetailsPayload, updateProductDetailsResponse, updateProductStatusPayload, updateProductStatusResponse, deleteProductResponse])