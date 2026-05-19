import { mergeResolvers } from '@graphql-tools/merge';
import { MutationResolvers } from './mutation/users/resolvers.js';
import { QueryResolvers } from './query/users/resolvers.js';

export const MergeAllResolvers = mergeResolvers([
  MutationResolvers, QueryResolvers
])