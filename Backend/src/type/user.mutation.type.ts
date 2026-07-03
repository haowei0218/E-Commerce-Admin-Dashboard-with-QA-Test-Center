import { RoleCode } from "./user.base.type.js"

export type AccountStatus = "active" | "inactive"

export type UserInformation = {
    id?: string
    name: string
    email: string
    password_hash: string
    role_id: RoleCode
    status: string
}

export type userInfo = {
    id: string
    name: string
    email: string
    role_id: RoleCode
    status: AccountStatus
}

export type ContextUserInfo = userInfo & {
    role_code: string
    manage_level: number
}


export type RegisterUserResponse = {
    registerUserInfo: userInfo
}

export type UpdateUserResponse = {
    updateUserInfo: userInfo
}

export type StatusPayload = {
    id: string
    status: AccountStatus
}

export type SetUserStatusResponse = {
    setUserStatus: userInfo
}

export type ResetPasswordResponse = {
    resetUser: userInfo
}