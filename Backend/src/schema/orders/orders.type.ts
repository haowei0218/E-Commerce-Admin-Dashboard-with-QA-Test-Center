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
        order_items:[OrderItemsDetails]!
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
        order_number:String
        customer_id:ID
        shipping_fee:Float!
        total_amount:Float!
        recipient_name:String!
        recipient_phone:String!
        shipping_city:String!
        shipping_district:String!
        shipping_address:String!
        shipping_zip_code:String!
        note:String
        order_items:[orderItemsInput]
    }


`

export const createOrderResponse = gql`
    type createOrderResponse  {
        details:OrderDetails
    }
`

export const mergeOrderTypeSchema = mergeTypeDefs([
  OrderSchema,
  OrderInput,
  createOrderResponse
])