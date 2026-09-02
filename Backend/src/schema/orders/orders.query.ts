import { gql } from 'graphql-tag'
import { getOrdersResponse, getOrdersByIdResponse, ordersFilterInput, getAllOrdersResponse } from './orders.type.js'


export const OrdersQuery = gql`
    ${getOrdersResponse}
    ${getOrdersByIdResponse}
    ${ordersFilterInput}
    ${getAllOrdersResponse}
    type Query{
        getOrders(input:ordersFilterInput):getOrdersResponse!
        getOrderById(id:ID!):getOrdersByIdResponse!
        getAllOrders:getAllOrdersResponse!
    }
`