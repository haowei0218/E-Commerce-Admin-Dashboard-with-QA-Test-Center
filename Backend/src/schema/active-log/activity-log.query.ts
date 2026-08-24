import { gql } from "graphql-tag";
import { activityLog } from "./activity-log.type.js";
export const ActivityLogQueryDefs = gql`
    ${activityLog}
    type Query {
        ActivityLogs(userId:String):[activityLog]!
    }
`