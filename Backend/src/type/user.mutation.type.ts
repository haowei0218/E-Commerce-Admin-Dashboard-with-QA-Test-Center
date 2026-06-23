import { RoleCode } from "./user.base.type.js"

export type AccountStatus = "active" | "inactive"

export type UserInformation = {
    id?:string
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

export type RegisterUserResponse = {
    registerUserInfo: userInfo
}

export type UpdateUserResponse = {
    updateUserInfo: userInfo
}