import { user } from "./user.base.type.js"

export type roleCode = 'Admin' | 'Manager' | 'Staff' | 'Viewer' | 'QA' | 'Developer'
export type accountStatus = 'Inactive' | "Active"

export type userLoginPayload = {
    account: string
    password: string
}

export type UserLoginResponse = {
    userProfile: user
    token: string
}

export type GetUsersResponse = {
    getUsers: queryUser[]
}

export type GetUserByIdResponse = {
    getUsers: queryUser
}

export type getUserByPropertiesPayload = {
    status: accountStatus
    role_id: number
    keyword: string
}

export type queryUser = {
    id: string
    name: string
    email: string
    code: roleCode
    status: string
    create_at: string
}

export type GetUserByPropertiesResponse = {
    getUsers: queryUser[]
}