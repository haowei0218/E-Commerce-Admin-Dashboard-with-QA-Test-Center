export const GET_ACTIVE_LOG = /* GraphQL */`
query ActivityLogs($userId: String) {
  ActivityLogs(userId: $userId) {
    id
    user_id
    action
    description
    create_at
    module
  }
}
`