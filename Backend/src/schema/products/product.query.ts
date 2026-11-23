import { gql } from 'graphql-tag'
import { filterProductsPayload, getProductsResponse, productResponse, productsStatisticsResponse } from './product.type.js'
export const productQuery = gql`
    ${filterProductsPayload}
    ${getProductsResponse}
    ${productResponse}
    ${productsStatisticsResponse}
    type Query{
        getProducts(input:filterProductsPayload):getProductsResponse
        getProductById(id:String):productResponse
        getProductsStatistics:productsStatisticsResponse
    }

`