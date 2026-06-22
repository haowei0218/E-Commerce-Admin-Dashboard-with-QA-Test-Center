import { gql } from "graphql-tag";
import { mergeTypeDefs } from "@graphql-tools/merge";




export const activityLog = gql`
    type activityLog  {
        id:String
        user_id:String
        action:String
        description:String
        create_at:String
    }
`
export const activityLogResponse = gql`
    type activityLogResponse {
        event:activityLog
        message:String
    }
`

export const mergeActivityLogsTypedefs = mergeTypeDefs([activityLog,activityLogResponse])