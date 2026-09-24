import { gql } from 'graphql-tag'
import {
    productPayload, productResponse
    , createProductResponse, updateProductDetailsPayload, updateProductDetailsResponse, deleteProductResponse, updateProductStatusPayload, updateProductStatusResponse
} from './product.type.js'
export const productMutation = gql`
    ${productPayload}
    ${createProductResponse}
    ${updateProductDetailsPayload}
    ${updateProductDetailsResponse}
    ${updateProductStatusPayload}
    ${updateProductStatusResponse}
    ${productResponse}
    type Mutation{
        createProduct(input:productPayload):productResponse
        updateProductDetails(input:updateProductDetailsPayload):productResponse
        updateProductStatus(input:updateProductStatusPayload):productResponse

    }

`