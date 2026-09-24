import { gql } from 'graphql-tag'
import { filterProductsPayload, getProductsResponse, productResponse } from './product.type.js'
export const productQuery = gql`
    ${filterProductsPayload}
    ${getProductsResponse}
    ${productResponse}
    type Query{
        getProducts(input:filterProductsPayload):getProductsResponse
        getProductById(id:String):productResponse
    }

`