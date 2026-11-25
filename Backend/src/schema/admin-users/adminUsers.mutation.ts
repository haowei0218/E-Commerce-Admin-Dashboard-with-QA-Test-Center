import { gql } from 'graphql-tag'
import { UserResponse, LogoutResponse, ChangePasswordResponse, UpdateMyProfileResponse, SetAdminUserRoleResponse, UserInput } from './adminUsers.type.js'

export const UsersMutationDefs = gql`
    ${UserResponse}
    ${LogoutResponse}
    ${ChangePasswordResponse}
    ${UpdateMyProfileResponse}
    ${SetAdminUserRoleResponse}
    ${UserInput}
    type Mutation {
        CreateAdminUser(input:UserInput):UserResponse!
        SetAdminUserInactive(id:String!,status:String):UserResponse!
        SetAdminUserActive(id:String!,status:String):UserResponse!
        AdminUserLogout:LogoutResponse!
        ChangePassword(id:String!,newPassword:String!):ChangePasswordResponse!
        UpdateMyProfile(id:String!,name:String,email:String):UpdateMyProfileResponse!
        SetAdminUserRole(id:String!,role_id:Int):SetAdminUserRoleResponse!
    }
`