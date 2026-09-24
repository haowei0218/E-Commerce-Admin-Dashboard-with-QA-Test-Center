import { mergeResolvers } from '@graphql-tools/merge';
import { UsersMutationResolvers } from './admin-users/adminUsers.mutation.js';
import { UsersQueryResolvers } from './admin-users/adminUsers.query.js';
import { ActivityLogsQueryResolvers } from './active-log/activity-logs.mutation.js';
import { OrdersMutationResolvers } from './orders/orders.mutation.js';
import { OrdersQueryResolvers } from './orders/orders.query.js';
import { OrderEventQueryResolvers } from './order-event/orderEvent.query.js';
import { ProductsQueryResolvers } from './products/products.query.js';
import { ProductsMutationResolvers } from './products/products.mutation.js';


export const MergeAllResolvers = mergeResolvers([
  UsersMutationResolvers, UsersQueryResolvers, ActivityLogsQueryResolvers, OrdersMutationResolvers, OrdersQueryResolvers, OrderEventQueryResolvers, ProductsQueryResolvers, ProductsMutationResolvers
])