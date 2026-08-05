import { gql } from 'graphql-tag'
import { UserResponse, LogoutResponse, ChangePasswordResponse, UpdateMyProfileResponse, SetAdminUserRoleResponse } from '../type/users.type.schema.js'

export const UsersMutationDefs = gql`
    ${UserResponse}
    ${LogoutResponse}
    ${ChangePasswordResponse}
    ${UpdateMyProfileResponse}
    type Mutation {
        CreateAdminUser(name:String!,email:String,password_hash:String,role_id:Int,status:String!):UserResponse!
        UpdateAdminUserProfile(id:String!,name:String!,email:String,password_hash:String):UserResponse!
        UpdateProfile(id:String!,name:String!,email:String,password_hash:String,role_id:Int,status:String!):UserResponse!
        SetAdminUserInactive(id:String!,status:String):UserResponse!
        SetAdminUserActive(id:String!,status:String):UserResponse!
        AdminUserLogout:LogoutResponse!
        ChangePassword(id:String!,newPassword:String!):ChangePasswordResponse!
        UpdateMyProfile(id:String!,name:String,email:String):UpdateMyProfileResponse!
        SetAdminUserRole(id:String!,role_id:Int):SetAdminUserRoleResponse!
    }
`