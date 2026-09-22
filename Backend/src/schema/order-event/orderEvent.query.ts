
import { gql } from "graphql-tag";
import { OrderEventResponse } from "./orderEvent.type.js";
export const orderEventQuery = gql`
    ${OrderEventResponse}
    type Query{
        getOrderEvent(order_id:String):OrderEventResponse!
    }
`
