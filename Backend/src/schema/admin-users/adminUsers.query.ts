import { gql } from "graphql-tag";
import { UserLoginResponse, GetUsersResponse, GetUserByIdResponse, GetAdminUserTimeLineResponse, GetAdminUserStatisticsResponse } from "./adminUsers.type.js";
export const UserQueryDefs = gql`
    ${UserLoginResponse}
    ${GetUsersResponse}
    ${GetUserByIdResponse}
    ${GetAdminUserTimeLineResponse}
    ${GetAdminUserStatisticsResponse}
    type Query {
        UserLogin(account:String,password:String):UserLoginResponse!
        GetAdminUsers:GetUsersResponse!
        GetAdminUserById(userId:String):GetUserByIdResponse!
        GetAdminUserByProperties(status:String,role_id:Int,keyword:String,page:Int,pageSize:Int):GetUsersResponse!
        GetAdminUserTimeLine(userId:String):GetAdminUserTimeLineResponse!
        GetAdminUserStatistics:GetAdminUserStatisticsResponse!
    }
`;
