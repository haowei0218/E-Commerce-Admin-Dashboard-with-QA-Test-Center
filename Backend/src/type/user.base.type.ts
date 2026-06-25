import { Pool } from 'pg'
import { ContextUserInfo, userInfo } from './user.mutation.type.js'

export type user = {
    id: string
    name: string
    email: string
    role_id: number
    status: string
}

export type ServerContext = {
    db: Pool;
    token: string | null
    user: ContextUserInfo
}

export type RoleMap = {
    1: "Admin",
    2: "Manager",
    3: "Staff",
    4: "Viewer",
    5: "QA",
    6: "Developer"
}

export type RoleCode = keyof RoleMap