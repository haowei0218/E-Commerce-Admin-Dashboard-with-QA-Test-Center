import { gql } from 'graphql-tag'
import { OrderInput, createOrderResponse, updateOrderStatusInput, updateOrderStatusResponse, updatePaymentStatusInput, updatePaymentStatusResponse, updateShippingStatusInput, updateShippingStatusResponse, updateOrderRecipientInput, updateOrderRecipientResponse, updateOrderNoteInput, updateOrderNoteResponse } from './orders.type.js'

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
    ${updateOrderNoteInput}
    ${updateOrderNoteResponse}
    type Mutation {
        createOrder(input:createOrderInput):createOrderResponse!
        updateOrderStatus(input:updateOrderStatusInput):updateOrderStatusResponse!
        updatePaymentStatus(input:updatePaymentStatusInput):updatePaymentStatusResponse!
        updateShippingStatus(input:updateShippingStatusInput):updateShippingStatusResposne!
        updateOrderRecipient(input:updateOrderRecipientInput):updateOrderRecipientResponse!
        updateOrderNote(input:updateOrderNoteInput):updateOrderNoteResponse!
    }
`