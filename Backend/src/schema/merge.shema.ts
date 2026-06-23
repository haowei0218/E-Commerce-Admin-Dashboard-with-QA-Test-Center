import { gql } from 'graphql-tag'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { mergeUserTypeDefs } from './type/users.type.schema.js'
import { UserQueryDefs } from './query/users.query.schema.js'
import { UsersMutationDefs } from './mutation/users.mutation.schema.js'
import { ActivityLogQueryDefs } from './query/activity-log.query.schema.js'
export const baseTypeDefs = gql`
 type Query{
  hello:String
 }

 type Mutation{
  hello:String
 }
`
export const mergeSchema = mergeTypeDefs([mergeUserTypeDefs, UserQueryDefs, UsersMutationDefs,ActivityLogQueryDefs])

