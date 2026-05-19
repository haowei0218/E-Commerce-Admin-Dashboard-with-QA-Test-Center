export interface Role {
    id: number,
    code: string,
    role_name: string
}

export type UserLoginPayload = {
    account: string
    password: string
}

export type UserProfile = {
    id: string,
    name: string,
    email: string,
    role_id: number,
    status: string
}

export type UserLoginResponse = {
    userProfile: UserProfile
    token: string
}


