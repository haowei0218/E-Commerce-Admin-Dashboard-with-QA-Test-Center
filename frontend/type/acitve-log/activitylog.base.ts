export type action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
export type activelogsPayload = {
    userId:string
}
export type ActivityEvent = {
    id: string,
    user_id: string
    action: action
    description: string,
    create_at: string,
    module:string
}
export type ActivityLogs = ActivityEvent[]
export type activityLogResponse = {
    ActivityLogs: ActivityEvent[]
    message: string
}