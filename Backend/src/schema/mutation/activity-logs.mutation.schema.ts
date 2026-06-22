import {gql} from "graphql-tag";
import { activityLog,activityLogResponse } from "../type/activity-log.type.schema.js";
export const ActivityLogsMutationDefs = gql`
    ${activityLog}
    ${activityLogResponse}
    type Mutation {
        createActivityLog(user_id:String,action:String,description:String):activityLogResponse!
    } 

`