import { mergeResolvers } from '@graphql-tools/merge';
import { UsersMutationResolvers } from './mutation/adminUsers.resolvers.js';
import { UsersQueryResolvers } from './query/adminUsers.resolvers.js';
import { ActivityLogsQueryResolvers } from './query/activity-logs.resolvers.js';

 

export const MergeAllResolvers = mergeResolvers([
  UsersMutationResolvers, UsersQueryResolvers,ActivityLogsQueryResolvers
])