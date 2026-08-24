import { mergeResolvers } from '@graphql-tools/merge';
import { UsersMutationResolvers } from './admin-users/adminUsers.mutation.js';
import { UsersQueryResolvers } from './admin-users/adminUsers.query.js';
import { ActivityLogsQueryResolvers } from './active-log/activity-logs.mutation.js';
import { OrdersMutationResolvers } from './orders/orders.mutation.js';



export const MergeAllResolvers = mergeResolvers([
  UsersMutationResolvers, UsersQueryResolvers, ActivityLogsQueryResolvers, OrdersMutationResolvers
])