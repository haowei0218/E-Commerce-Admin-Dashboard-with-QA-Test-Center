import { mergeResolvers, mergeResolvers } from '@graphql-tools/merge';
import { resolvers } from './mutation/users/resolvers.js';
import { resolvers } from './query/users/resolvers.js';

export const mergeResolvers = mergeResolvers([
  resolvers, resolvers
])