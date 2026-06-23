import { gql } from 'graphql-tag'
import { UserResponse } from '../type/users.type.schema.js'

export const UsersMutationDefs = gql`
    ${UserResponse}
    type Mutation {
        RegisterUser(name:String!,email:String,password_hash:String,role_id:Int,status:String!):UserResponse!
        UpdateUser(name:String!,email:String,password_hash:String,role_id:Int,status:String!):UserResponse!
    }
`