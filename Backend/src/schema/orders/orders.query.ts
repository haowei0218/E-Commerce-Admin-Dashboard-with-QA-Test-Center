import { gql } from 'graphql-tag'
import { getOrdersResponse, getOrdersByIdResponse, ordersFilterInput, getAllOrdersResponse, getOrdersStatisticsResponse } from './orders.type.js'


export const OrdersQuery = gql`
    ${getOrdersResponse}
    ${getOrdersByIdResponse}
    ${ordersFilterInput}
    ${getAllOrdersResponse}
    ${getOrdersStatisticsResponse}
    type Query{
        getOrders(input:ordersFilterInput):getOrdersResponse!
        getOrderById(id:ID!):getOrdersByIdResponse!
        getAllOrders:getAllOrdersResponse!
        getOrdersStatistics:getOrdersStatisticsResponse!
    }
`