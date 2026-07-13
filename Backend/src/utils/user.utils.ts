import { userLoginPayload, UserLoginResponse, GetUsersResponse, GetUserByIdResponse } from "../type/user.query.type.js";
import { GraphQLError } from "graphql";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { throwGraphqlError } from "./error.utils.js";
import { env } from "../env.local.js";
import { SetUserStatusResponse, RegisterUserResponse, UpdateUserResponse, UserInformation, StatusPayload, ResetPasswordResponse } from "../type/user.mutation.type.js";
import { ServerContext } from "../type/user.base.type.js";


/**email format check */
export function emailFormatCheck(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}


export async function userLogin({ account, password }: userLoginPayload, context: ServerContext): Promise<UserLoginResponse> {
    const result = await context.db.query(
        `SELECT 
        id,
        name,
        email,
        password_hash,
        role_id,
        status FROM users WHERE email=$1`,
        [account],
    );

    const user = result.rows[0] ?? null;

    /**驗證帳號 */
    if (!user) {
        throwGraphqlError("Invalid email or password", "USER_NOT_FOUND")
    }

    /**驗證密碼 */
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
    );

    if (!isPasswordValid) {
        throwGraphqlError("Invalid email or password", "UNAUTHENTICATED")
    }

    /**驗證帳戶狀態 */
    if (user.status !== "active") {
        throw new GraphQLError("Account is inactive", {
            extensions: {
                code: "FORBIDDEN",
            },
        });
    }
    const token = jwt.sign({ userid: user.id, accountName: user.name }, env.jwtSecret)
    return {
        userProfile: {
            id: user.id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            status: user.status,
        },
        token: token
    }
}

export async function registerUser({ name, email, password_hash, role_id, status }: UserInformation, context: ServerContext): Promise<RegisterUserResponse> {
    try {
        const hashPassword = await bcrypt.hash(password_hash, 10)
        const result = await context.db.query(`
            INSERT INTO users (name,email,password_hash,role_id,status,create_at) values ($1,$2,$3,$4,$5,NOW()) 
            RETURNING id, name, email, role_id, status, create_at
            `, [name, email, hashPassword, role_id, status])
        return { registerUserInfo: result.rows[0] }
    } catch (error: any) {
        if (error.code === "23505") {
            throwGraphqlError("Email already exists", "EMAIL_ALREADY_EXISTS");
        }
        throw error
    }
}

/**在邏輯上 只能更改自己的Profile 不可以更改別人的 */
export async function updateUser({ id, name, email, password_hash }: Omit<UserInformation, 'role_id' | 'status'>, context: ServerContext): Promise<UpdateUserResponse> {

    if (id !== context.user.id) {
        throwGraphqlError("You do not have permission to perform this action", 'FORBIDDEN')
    }

    if (
        !id?.trim() ||
        !name?.trim() ||
        !email?.trim() ||
        !password_hash?.trim()
    ) {
        throwGraphqlError("Invalid input data", "INVALID_INPUT_DATA");
    }

    if (!emailFormatCheck(email)) {
        throwGraphqlError('Email format is invalid', 'EMAIL_FORMAT_INVALID')
    }

    try {
        const NewPasswordHash = await bcrypt.hash(password_hash, 10) ?? ''
        const result = await context.db.query(`UPDATE users SET name=$1,email=$2,password_hash=COALESCE($3, password_hash) WHERE id=$4 RETURNING id,name,email,role_id,status`, [name.trim(), email, NewPasswordHash, id])
        const updateUser = result.rows[0]

        if (!updateUser) {
            throwGraphqlError('User not found', 'USER_NOT_FOUND')
        }
        return { updateUserInfo: updateUser }
    } catch (error: unknown) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23505"
        ) {
            throwGraphqlError("Email already exists", "EMAIL_ALREADY_EXISTS");
        }

        throw error;
    }


}

/**根據權限矩陣 部分role_id擁有更改其他使用者狀態的權限 */
export async function setUserStatus({ id, status }: StatusPayload, context: ServerContext): Promise<SetUserStatusResponse> {
    const result = await context.db.query(`UPDATE users SET status=$2 WHERE id=$1 RETURNING id,name,email,role_id,status`, [id, status])
    return { setUserStatus: result.rows[0] }
}

export async function getUsers(context: ServerContext): Promise<GetUsersResponse> {
    const result = await context.db.query('SELECT id,name,email,role_id,status FROM users WHERE role_id > $1 AND id <> $2', [context.user.role_id, context.user.id])
    return { getUsers: result.rows }
}

export async function getUserById(userId: string, context: ServerContext): Promise<GetUserByIdResponse> {
    const result = await context.db.query(`SELECT * FROM users WHERE id=$1`, [userId])
    return { userInfo: result.rows[0] }
}

export async function resetPassword(userId: string, password_hash: string, context: ServerContext): Promise<ResetPasswordResponse> {
    if (userId.length === 0) {
        throwGraphqlError('Invalid input data', 'INVALID_INPUT_DATA')

    }
    const NEW_PASSWORD_HASH = await bcrypt.hash(password_hash, 10)
    const result = await context.db.query(`UPDATE users SET password_hash=$1 WHERE id=$2 RETURNING id,name,email,role_id,status`, [NEW_PASSWORD_HASH, userId])
    return {
        resetUser: result.rows[0]
    }
}