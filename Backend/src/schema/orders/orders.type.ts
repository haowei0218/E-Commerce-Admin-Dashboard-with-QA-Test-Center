import { mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from "graphql-tag";


export const OrderSchema = gql`
    type OrderItemsDetails {
        id:ID!
        order_id:ID
        product_id:ID
        sku:String
        product_name:String
        product_image_url:String
        purchase_quantity:Int
        price:Float!
        total_amount:Float!
        created_at:String
    }
    type OrderDetails{
        id:ID
        order_number:String
        customer_id:ID
        shipping_fee:Float!
        total_amount:Float!
        order_status:String!
        payment_status:String!
        shipping_status:String!
        recipient_name:String!
        recipient_phone:String!
        shipping_city:String!
        shipping_district:String!
        shipping_address:String!
        shipping_zip_code:String!
        note:String
        paid_at:String
        completed_at:String
        cancelled_at:String
        cancel_reason:String
        created_at:String!
        updated_at:String!
        payment_method:String!
        order_items:[OrderItemsDetails]
    }
`

export const OrderInput = gql`
    input orderItemsInput {
        order_id:ID
        product_id:ID
        sku:String!
        product_name:String!
        product_image_url:String
        purchase_quantity:Int!
        price:Float!
        total_amount:Float!
    }
    input createOrderInput{
        customer_id:ID
        recipient_name:String!
        recipient_phone:String!
        shipping_city:String!
        shipping_district:String!
        shipping_address:String!
        shipping_zip_code:String!
        note:String
        payment_method:String
        order_items:[orderItemsInput]
    }
`

export const createOrderResponse = gql`
    type createOrderResponse  {
        details:OrderDetails
    }
`

export const updateOrderStatusInput = gql`
    input updateOrderStatusInput {
        id:ID!
        order_status:String!
        cancel_reason:String
    }
`

export const updateOrderStatusResponse = gql`
    type updateOrderStatusResponse {
        updateDetails:OrderDetails
    }
`

export const updatePaymentStatusInput = gql`
    input updatePaymentStatusInput {
        id:ID!
        payment_status:String!
    }
`

export const updatePaymentStatusResponse = gql`
    type updatePaymentStatusResponse {
        updatePaymentDetails:OrderDetails
    }
`

export const updateShippingStatusInput = gql`
    input updateShippingStatusInput {
        id:ID!
        shipping_status:String!
    }
`

export const updateShippingStatusResponse = gql`
    type updateShippingStatusResposne {
        updateShippingDetails:OrderDetails
    }
`

export const updateOrderRecipientInput = gql`
    input updateOrderRecipientInput {
        id:ID!
        recipient_name:String
        recipient_phone:String
        shipping_city:String
        shipping_district:String
        shipping_address:String
        shipping_zip_code:String
    }
`

export const updateOrderRecipientResponse = gql`
    type updateOrderRecipientResponse {
        updateOrderRecipientDetails:OrderDetails
    }
`

export const getOrdersResponse = gql`
    type getOrdersResponse{
        getOrders:[OrderDetails]
        total_count:Int
        page:Int
        pageSize:Int
    }
`
export const getOrdersByIdResponse = gql`
    type getOrdersByIdResponse{
        getOrdersById:[OrderDetails]
    }
`

export const ordersFilterInput = gql`
    input ordersFilterInput{
        keyword: String
        order_status: String
        payment_status: String
        shipping_status: String
        date_from: String
        date_to: String
        page: Int
        pageSize: Int
    }
`

export const updateOrderNoteInput = gql`
    input updateOrderNoteInput{
        id:ID!
        note:String
    }
`
export const updateOrderNoteResponse = gql`
    type updateOrderNoteResponse {
        updateOrderNoteDetails:OrderDetails!
    }
`

export const getAllOrdersResponse = gql`
    type getAllOrdersResponse {
        all:[OrderDetails]
    }
`

export const mergeOrderTypeSchema = mergeTypeDefs([
    OrderSchema,
    OrderInput,
    createOrderResponse,
    updateOrderStatusInput,
    updateOrderStatusResponse,
    updatePaymentStatusInput,
    updatePaymentStatusResponse,
    updateShippingStatusInput,
    updateShippingStatusResponse,
    updateOrderRecipientInput,
    updateOrderRecipientResponse,
    getOrdersResponse,
    getOrdersByIdResponse,
    ordersFilterInput,
    updateOrderNoteInput,
    updateOrderNoteResponse,
    getAllOrdersResponse
])