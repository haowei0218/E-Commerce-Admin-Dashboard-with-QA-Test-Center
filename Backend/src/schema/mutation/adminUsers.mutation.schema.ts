import { gql } from 'graphql-tag'
import { UserResponse, LogoutResponse } from '../type/users.type.schema.js'

export const UsersMutationDefs = gql`
    ${UserResponse}
    ${LogoutResponse}
    type Mutation {
        CreateAdminUser(name:String!,email:String,password_hash:String,role_id:Int,status:String!):UserResponse!
        UpdateAdminUserProfile(id:String!,name:String!,email:String,password_hash:String):UserResponse!
        UpdateProfile(id:String!,name:String!,email:String,password_hash:String,role_id:Int,status:String!):UserResponse!
        SetAdminUserInactive(id:String!,status:String):UserResponse!
        SetAdminUserActive(id:String!,status:String):UserResponse!
        ResetAdminUserPassword(id:String!,password_hash:String!):UserResponse!
        AdminUserLogout:LogoutResponse!
    }
`