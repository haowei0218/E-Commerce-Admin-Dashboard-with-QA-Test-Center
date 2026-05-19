import { gql } from "graphql-tag";
import { UserLoginResponse,RegisterUserResponse } from "../../type/users/typeDefs.js";
export const UserQueryDefs = gql`
    ${UserLoginResponse}
    type Query {
        UserLogin(account:String,password:String):UserLoginResponse!
    }
`;
