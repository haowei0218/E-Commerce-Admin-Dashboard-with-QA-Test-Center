import { gql } from 'graphql-tag'
import { UserResponse } from '../type/users.type.schema.js'

export const UsersMutationDefs = gql`
    ${UserResponse}
    type Mutation {
        CreateUser(name:String!,email:String,password_hash:String,role_id:Int,status:String!):UserResponse!
        UpdateUserProfile(id:String!,name:String!,email:String,password_hash:String):UserResponse!
        SetUserInactive(id:String!,status:String):UserResponse!
        SetUserActive(id:String!,status:String):UserResponse!
        ResetUserPassword(id:String!,password_hash:String!):UserResponse!
    }
`