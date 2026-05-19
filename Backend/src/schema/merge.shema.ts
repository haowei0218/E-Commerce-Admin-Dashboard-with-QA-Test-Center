import { gql } from 'graphql-tag'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { mergeUserTypeDefs } from './type/users/typeDefs.js'
import { UserQueryDefs } from './query/users/queryDefs.js'
import { UsersMutationDefs } from './mutation/users/mutationDefs.js'
export const baseTypeDefs = gql`
 type Query{
  hello:String
 }

 type Mutation{
  hello:String
 }
`
export const mergeSchema = mergeTypeDefs([mergeUserTypeDefs, UserQueryDefs, UsersMutationDefs])

