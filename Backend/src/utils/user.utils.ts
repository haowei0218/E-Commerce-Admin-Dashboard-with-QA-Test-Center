import { userLoginPayload, userLoginResponse } from "../type/user.query.type.js";
import { GraphQLError } from "graphql";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { throwGraphqlError } from "./error.utils.js";
import { env } from "../env.local.js";
import { RegisterUserResponse, UpdateUserResponse, UserInformation } from "../type/user.mutation.type.js";
import { ServerContext } from "../type/user.base.type.js";

export async function userLogin({ account, password }: userLoginPayload, context: ServerContext): Promise<userLoginResponse> {
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
        throwGraphqlError("Invalid email or password", "UNAUTHORIZED")
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
            throwGraphqlError("Email already exists", "EMAIL_ALREADY_EXIST");
        }
        throw error
    }
}

export async function updateUser({ id, name, email, password_hash, role_id, status }: UserInformation, context: ServerContext): Promise<UpdateUserResponse> {
    try {
        const new_passwordHash = await bcrypt.hash(password_hash, 10) ?? ''
        const result = await context.db.query(`UPDATE users SET name=$1 , email=$2 , password_hash=COALESCE($3, password_hash), , role_id=$4 , status=$5 WHERE id=$6 RETURNING id,name,email,role_id,status`, [name, email, new_passwordHash, role_id, status, id])
        return { updateUserInfo: result.rows[0] }
    } catch (error) {
        throw error
    }
}