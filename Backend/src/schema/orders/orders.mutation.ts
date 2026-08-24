import { gql } from 'graphql-tag'
import { OrderInput ,createOrderResponse} from './orders.type.js'

export const OrdersMutation = gql`
    ${OrderInput}
    ${createOrderResponse}
    type Mutation {
        createOrder(input:createOrderInput):createOrderResponse!
    }
`