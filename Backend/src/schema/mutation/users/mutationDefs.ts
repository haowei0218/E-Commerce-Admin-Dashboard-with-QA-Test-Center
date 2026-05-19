import { gql } from 'graphql-tag'
import { RegisterUserResponse } from '../../type/users/typeDefs.js'

export const UsersMutationDefs = gql`
    ${RegisterUserResponse}
    type Mutation {
        RegisterUser(name:String!,email:String,password_hash:String,role_id:Int,status:String!):RegisterUserResponse!
    }
`