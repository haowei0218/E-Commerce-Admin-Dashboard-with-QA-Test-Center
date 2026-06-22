import { ActivityEvent } from "../../type/activitylog.type.js";
import { ServerContext } from "../../type/user.base.type.js";
import { createActivityLog } from "../../utils/activity-log.utils.js";

export const ActivityLogsMutationResolvers = {
    Mutation: {
        createActivityLog: async (_parent: unknown, { user_id, action, description }: Omit<ActivityEvent, 'id' | 'create_at'>, context: ServerContext) => {
            return await createActivityLog({ user_id, action, description }, context)
        }
    }
}