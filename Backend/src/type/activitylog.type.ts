export type action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
export type activelogsPayload = {
    userId:string
}
export type ActivityEvent = {
    id: string,
    user_id: string
    action: action
    description: string,
    create_at: string
}
export type ActivityLogs = ActivityEvent[]
export type activityLogResponse = {
    event: ActivityEvent
    message: string
}