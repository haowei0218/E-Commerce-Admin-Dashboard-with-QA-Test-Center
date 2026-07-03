import { user } from "./user.base.type.js"

export type userLoginPayload = {
    account: string
    password: string
}

export type UserLoginResponse = {
    userProfile: user
    token: string
}

export type GetUsersResponse = {
    getUsers: user[]
}

export type GetUserByIdResponse = {
    userInfo: user
}