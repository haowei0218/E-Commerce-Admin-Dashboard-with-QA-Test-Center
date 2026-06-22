import { gql } from "graphql-tag";
import { activityLog } from "../type/activity-log.type.schema.js";
export const ActivityLogQueryDefs = gql`
    ${activityLog}
    type Query {
        ActivityLogs(userId:String):[activityLog]!
    }
`