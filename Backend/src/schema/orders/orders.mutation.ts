import { gql } from 'graphql-tag'
import { OrderInput, createOrderResponse, updateOrderStatusInput, updateOrderStatusResponse, updatePaymentStatusInput, updatePaymentStatusResponse, updateShippingStatusInput, updateShippingStatusResponse } from './orders.type.js'

export const OrdersMutation = gql`
    ${OrderInput}
    ${createOrderResponse}
    ${updateOrderStatusInput}
    ${updateOrderStatusResponse}
    ${updatePaymentStatusInput}
    ${updatePaymentStatusResponse}
    ${updateShippingStatusInput}
    ${updateShippingStatusResponse}
    type Mutation {
        createOrder(input:createOrderInput):createOrderResponse!
        updateOrderStatus(input:updateOrderStatusInput):updateOrderStatusResponse!
        updatePaymentStatus(input:updatePaymentStatusInput):updatePaymentStatusResponse!
        updateShippingStatus(input:updateShippingStatusInput):updateShippingStatusResposne!
    }
`