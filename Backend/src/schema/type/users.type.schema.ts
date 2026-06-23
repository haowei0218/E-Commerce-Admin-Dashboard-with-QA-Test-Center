import { mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from "graphql-tag";

export const User = gql`
  type User {
    id: String
    name: String
    email: String
    role_id: Int
    status: String
  }
`;

export const UserInformation = gql`
  type UserInformation {
    id:String
    name:String
    email:String
    role_id:Int
    status:String
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


export const mergeUserTypeDefs = mergeTypeDefs([User, UserInformation, UserLoginResponse, UserResponse])