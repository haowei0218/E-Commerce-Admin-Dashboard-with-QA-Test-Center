import { mergeType, mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from "graphql-tag";



export const OrderEvent = gql`
    type OrderEvent{
        id:String!
        order_id:String!
        event_type:String!
        prev_status:String
        next_status:String
        description:String
        operator_id:String!
        created_at:String!
    }
`

export const OrderEventResponse = gql`
    type OrderEventResponse{
        result:[OrderEvent]
    }
`

export const event = gql`
    input event{
        order_id:String!
        event_type:String!
        prev_status:String
        next_status:String
        description:String
        operator_id:String  
    }
`


export const mergeOrderEventSchema = mergeTypeDefs([OrderEvent, OrderEventResponse])