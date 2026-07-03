import { gql } from "graphql-tag";
import { UserLoginResponse, GetUsersResponse,UserResponse } from "../type/users.type.schema.js";
export const UserQueryDefs = gql`
    ${UserLoginResponse}
    ${GetUsersResponse}
    type Query {
        UserLogin(account:String,password:String):UserLoginResponse!
        GetUsers:GetUsersResponse!
        GetUserById(userId:String):UserResponse!
    }
`;
