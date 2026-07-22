import { gql } from "graphql-tag";
import { UserLoginResponse, GetUsersResponse } from "../type/users.type.schema.js";
export const UserQueryDefs = gql`
    ${UserLoginResponse}
    ${GetUsersResponse}
    type Query {
        UserLogin(account:String,password:String):UserLoginResponse!
        GetUsers:GetUsersResponse!
        GetUserById(userId:String):GetUsersResponse!
        GetUserByProperties(status:String,role_id:Int,keyword:String):GetUsersResponse!
        
    }
`;
