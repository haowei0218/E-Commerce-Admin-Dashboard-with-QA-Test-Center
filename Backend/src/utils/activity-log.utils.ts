import { ActivityEvent, ActivityLogs } from "../type/activitylog.type.js";
import { ServerContext } from "../type/user.base.type.js";
import { throwGraphqlError } from "./error.utils.js";
import { action } from "../type/activitylog.type.js";


export function buildlogsMessage(username: string, action: string, data: string) {
    return `${username} ${action} ${data}`
}

export async function getActivityLogs(userid: string, context: ServerContext): Promise<ActivityLogs | undefined> {
    try {
        const result = await context.db.query(`SELECT * FROM activitylogs WHERE user_id = $1`, [userid])
        const activitylogs = result?.rows ?? []
        return activitylogs
    } catch (error) {
        console.error("Get activity logs failed:", error);
        throwGraphqlError(
            "Failed to retrieve activity logs",
            "ACTIVITY_LOGS_FAILED",
        );
    }
}

export async function createActivityLog(
    log: Omit<ActivityEvent, "id" | "create_at">,
    context: ServerContext,
) {
    try {
        const result = await context.db.query(
            `
      INSERT INTO activitylogs (
        user_id,
        action,
        description,
        create_at
      )
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `,
            [log.user_id, log.action, log.description],
        );

        console.log('result : ',result)
        const event = result.rows[0];

        if (!event) {
            throwGraphqlError(
                "Failed to create activity log",
                "ACTIVITY_LOGS_FAILED",
            );
        }

        console.log('event : ',event)

        return {
            event,
            message: "success",
        };
    } catch (error) {
        throw error
    }

}