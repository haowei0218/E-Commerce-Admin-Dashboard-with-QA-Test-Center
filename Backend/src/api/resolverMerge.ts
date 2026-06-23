import { mergeResolvers } from '@graphql-tools/merge';
import { UsersMutationResolvers } from './mutation/users.resolvers.js';
import { UsersQueryResolvers } from './query/users.resolvers.js';
import { ActivityLogsQueryResolvers } from './query/activity-logs.resolvers.js';

 

export const MergeAllResolvers = mergeResolvers([
  UsersMutationResolvers, UsersQueryResolvers,ActivityLogsQueryResolvers
])