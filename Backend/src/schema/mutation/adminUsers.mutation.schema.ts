import { gql } from 'graphql-tag'
import { UserResponse } from '../type/users.type.schema.js'

export const UsersMutationDefs = gql`
    ${UserResponse}
    type Mutation {
        CreateAdminUser(name:String!,email:String,password_hash:String,role_id:Int,status:String!):UserResponse!
        UpdateAdminUserProfile(id:String!,name:String!,email:String,password_hash:String):UserResponse!
        SetAdminUserInactive(id:String!,status:String):UserResponse!
        SetAdminUserActive(id:String!,status:String):UserResponse!
        ResetAdminUserPassword(id:String!,password_hash:String!):UserResponse!
    }
`