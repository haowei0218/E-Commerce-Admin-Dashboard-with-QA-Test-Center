import { ActivityEvent, ActivityLogs } from "../type/active-log/activitylog.base.js";
import { ServerContext } from "../type/admin-users/adminUsers.base..js";
import { throwGraphqlError } from "./error.js";


export function buildlogsMessage(username: string, action: string, data: string) {
    return `${username} ${action} ${data}`
}

export async function getActivityLogs(userid: string, context: ServerContext): Promise<ActivityLogs | undefined> {
    const result = await context.db.query(`SELECT * FROM activitylogs WHERE user_id = $1`, [userid])
    const activelogs = result?.rows ?? []
    if (!activelogs) {
        throwGraphqlError(
            "Failed to retrieve activity logs",
            "ACTIVITY_LOGS_FAILED",
        );
    }
    return activelogs
}

export async function createActivityLog(
    log: Omit<ActivityEvent, "id" | "create_at">,
    context: ServerContext,
) {
    const result = await context.db.query(
        `
      INSERT INTO activitylogs (
        user_id,
        action,
        description,
        create_at,
        module
      )
      VALUES ($1, $2, $3, NOW(),$4)
      RETURNING *
    `,
        [log.user_id, log.action, log.description, log.module],
    );

    const event = result.rows[0];

    if (!event) {
        throwGraphqlError(
            "Failed to create activity log",
            "ACTIVITY_LOGS_FAILED",
        );
    }

    return {
        event,
        message: "success",
    };

}