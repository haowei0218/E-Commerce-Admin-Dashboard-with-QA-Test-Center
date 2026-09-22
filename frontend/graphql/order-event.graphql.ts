export const GET_ORDER_EVENT =/* GraphQL */`
query GetOrderEvent($orderId: String) {
  getOrderEvent(order_id: $orderId) {
    result {
      id
      order_id
      event_type
      prev_status
      next_status
      description
      operator_id
      created_at
    }
  }
}
`