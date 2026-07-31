import { gql } from "graphql-tag";
import { UserLoginResponse, GetUsersResponse,GetUserByIdResponse } from "../type/users.type.schema.js";
export const UserQueryDefs = gql`
    ${UserLoginResponse}
    ${GetUsersResponse}
    ${GetUserByIdResponse}
    type Query {
        UserLogin(account:String,password:String):UserLoginResponse!
        GetAdminUsers:GetUsersResponse!
        GetAdminUserById(userId:String):GetUserByIdResponse!
        GetAdminUserByProperties(status:String,role_id:Int,keyword:String):GetUsersResponse!
        
    }
`;
