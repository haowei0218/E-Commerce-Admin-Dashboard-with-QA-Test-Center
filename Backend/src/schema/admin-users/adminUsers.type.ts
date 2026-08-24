import { mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from "graphql-tag";

export const User = gql`
  type User {
    id: String
    name: String
    email: String
    role_id: Int
    status: String
    create_at:String
    manage_level:Int
    permissions:[String]
  }
`;

export const UserInformation = gql`
  type UserInformation {
    id: String!
    name: String!
    email: String!
    code: String!
    status: String!
    create_at:String!
    
  }
`

export const UserLoginResponse = gql`
  type UserLoginResponse {
    userProfile: User
    token: String!
  }
`;

export const UserResponse = gql`
  type UserResponse {
    userInfo: User
  }
`;

export const GetUsersResponse = gql`
  type GetUsersResponse {
    getUsers:[UserInformation]
  }
`
export const LogoutResponse = gql`
  type LogoutResponse {
    success: Boolean!
    message: String!
  }
`

export const GetUserByIdResponse = gql`
  type GetUserByIdResponse {
    getUserById:User
  }
`

export const ChangePasswordResponse = gql`
  type ChangePasswordResponse {
    userProfile:User
  }
`

export const UpdateMyProfileResponse = gql`
  type UpdateMyProfileResponse {
    userProfile:UserInformation
  }
`

export const SetAdminUserRoleResponse = gql`
  type SetAdminUserRoleResponse {
    userProfile:UserInformation
  }
`

export const mergeUserTypeDefs = mergeTypeDefs([User, UserLoginResponse, UserResponse, UserInformation, GetUsersResponse, LogoutResponse, GetUserByIdResponse, ChangePasswordResponse, UpdateMyProfileResponse, SetAdminUserRoleResponse])