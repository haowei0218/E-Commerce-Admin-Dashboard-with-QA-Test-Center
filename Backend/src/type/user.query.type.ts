import { user } from "./user.base.type.js"

export type userLoginPayload = {
    account: string
    password: string
}

export type userLoginResponse = {
    userProfile: user
    token: string
}
