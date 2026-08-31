import { gql } from 'graphql-tag'
import { getOrdersResponse, getOrdersByIdResponse, ordersFilterInput } from './orders.type.js'


export const OrdersQuery = gql`
    ${getOrdersResponse}
    ${getOrdersByIdResponse}
    ${ordersFilterInput}
    type Query{
        getOrders(input:ordersFilterInput):getOrdersResponse!
        getOrderById(id:ID!):getOrdersByIdResponse!
    }
`