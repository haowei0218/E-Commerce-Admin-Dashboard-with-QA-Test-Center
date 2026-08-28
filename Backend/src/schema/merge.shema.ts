import { mergeTypeDefs } from '@graphql-tools/merge'
import { mergeUserTypeDefs } from './admin-users/adminUsers.type.js'
import { mergeActivityLogsTypedefs } from './active-log/activity-log.type.js'
import { UserQueryDefs } from './admin-users/adminUsers.query.js'
import { UsersMutationDefs } from './admin-users/adminUsers.mutation.js'
import { ActivityLogQueryDefs } from './active-log/activity-log.query.js'
import { OrdersMutation } from './orders/orders.mutation.js'
import { mergeOrderTypeSchema } from './orders/orders.type.js'
import { OrdersQuery } from './orders/orders.query.js'

export const mergeSchema = mergeTypeDefs([mergeUserTypeDefs, UserQueryDefs, UsersMutationDefs, ActivityLogQueryDefs, mergeActivityLogsTypedefs, OrdersMutation, mergeOrderTypeSchema, OrdersQuery])

