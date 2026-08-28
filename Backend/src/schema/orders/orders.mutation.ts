import { gql } from 'graphql-tag'
import { OrderInput, createOrderResponse, updateOrderStatusInput, updateOrderStatusResponse, updatePaymentStatusInput, updatePaymentStatusResponse, updateShippingStatusInput, updateShippingStatusResponse, updateOrderRecipientInput, updateOrderRecipientResponse } from './orders.type.js'

export const OrdersMutation = gql`
    ${OrderInput}
    ${createOrderResponse}
    ${updateOrderStatusInput}
    ${updateOrderStatusResponse}
    ${updatePaymentStatusInput}
    ${updatePaymentStatusResponse}
    ${updateShippingStatusInput}
    ${updateShippingStatusResponse}
    ${updateOrderRecipientInput}
    ${updateOrderRecipientResponse}
    type Mutation {
        createOrder(input:createOrderInput):createOrderResponse!
        updateOrderStatus(input:updateOrderStatusInput):updateOrderStatusResponse!
        updatePaymentStatus(input:updatePaymentStatusInput):updatePaymentStatusResponse!
        updateShippingStatus(input:updateShippingStatusInput):updateShippingStatusResposne!
        updateOrderRecipient(input:updateOrderRecipientInput):updateOrderRecipientResponse!
    }
`