import { activelogsPayload } from "../../type/active-log/activitylog.base.js";
import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { getActivityLogs } from "../../utils/activity-log.js";

export const ActivityLogsQueryResolvers = {
    Query: {
        ActivityLogs: async (_parent: unknown, {userId}:activelogsPayload, context: ServerContext) => {
            return await getActivityLogs(userId, context)
        }
    }
}