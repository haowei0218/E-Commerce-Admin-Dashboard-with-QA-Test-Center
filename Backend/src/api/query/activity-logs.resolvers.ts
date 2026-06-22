import { activelogsPayload } from "../../type/activitylog.type.js";
import { ServerContext } from "../../type/user.base.type.js";
import { getActivityLogs } from "../../utils/activity-log.utils.js";

export const ActivityLogsQueryResolvers = {
    Query: {
        ActivityLogs: async (_parent: unknown, {userId}:activelogsPayload, context: ServerContext) => {
            return await getActivityLogs(userId, context)
        }
    }
}