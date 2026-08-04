import {
  userLoginPayload,
  UserLoginResponse,
  GetUsersResponse,
  GetUserByIdResponse,
  GetUserByPropertiesResponse,
  getUserByPropertiesPayload,
} from '../type/user.query.type.js'
import { GraphQLError } from 'graphql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { throwGraphqlError } from './error.utils.js'
import { env } from '../env.local.js'
import {
  SetUserStatusResponse,
  RegisterUserResponse,
  UpdateUserResponse,
  UserInformation,
  StatusPayload,
  changePasswordResponse,
} from '../type/user.mutation.type.js'
import { ServerContext } from '../type/user.base.type.js'
import type {
  Request,
  Response as ExpressResponse,
} from 'express';

/**email format check */
export function emailFormatCheck(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function userLogin(
  { account, password }: userLoginPayload,
  context: ServerContext
): Promise<UserLoginResponse> {
  const result = await context.db.query(
    `SELECT 
        id,
        name,
        email,
        password_hash,
        role_id,
        status, 
        create_at
        FROM users WHERE email=$1`,
    [account]
  )

  const user = result.rows[0] ?? null

  /**驗證帳號 */
  if (!user) {
    throwGraphqlError('Invalid email or password', 'USER_NOT_FOUND')
  }

  /**驗證密碼 */
  const isPasswordValid = await bcrypt.compare(password, user.password_hash)

  if (!isPasswordValid) {
    throwGraphqlError('Invalid email or password', 'UNAUTHENTICATED')
  }

  /**驗證帳戶狀態 */
  if (user.status !== 'Active') {
    throw new GraphQLError('Account is inactive', {
      extensions: {
        code: 'FORBIDDEN',
      },
    })
  }
  const token = jwt.sign(
    { userid: user.id, accountName: user.name },
    env.jwtSecret,
    {
      algorithm: 'HS256',
      expiresIn: '1h',
    }
  )
  context.res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 1000, // 1 小時
  });
  return {
    userProfile: {
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
      status: user.status,
      create_at: user.create_at,
    },
    token: token,
  }
}

export async function createAdminUser(
  { name, email, password_hash, role_id, status }: UserInformation,
  context: ServerContext
): Promise<RegisterUserResponse> {
  try {
    const hashPassword = await bcrypt.hash(password_hash, 10)
    const result = await context.db.query(
      `
            INSERT INTO users (name,email,password_hash,role_id,status,create_at) values ($1,$2,$3,$4,$5,NOW()) 
            RETURNING id, name, email, role_id, status, create_at
            `,
      [name, email, hashPassword, role_id, status]
    )
    return { userInfo: result.rows[0] }
  } catch (error: any) {
    if (error.code === '23505') {
      throwGraphqlError('Email already exists', 'EMAIL_ALREADY_EXISTS')
    }
    throw error
  }
}

/**在邏輯上 只能更改自己的Profile 不可以更改別人的 */
export async function updateAdminUser(
  {
    id,
    name,
    email,
    role_id,
    status,
    password_hash,
  }: UserInformation,
  context: ServerContext
): Promise<UpdateUserResponse> {
  if (id !== context.user.id) {
    throwGraphqlError(
      'You do not have permission to perform this action',
      'FORBIDDEN'
    )
  }

  if (
    !id?.trim() ||
    !name?.trim() ||
    !email?.trim() ||
    !password_hash?.trim() ||
    !role_id ||
    !status?.trim()
  ) {
    throwGraphqlError('Invalid input data', 'INVALID_INPUT_DATA')
  }

  if (!emailFormatCheck(email)) {
    throwGraphqlError('Email format is invalid', 'EMAIL_FORMAT_INVALID')
  }

  try {
    const NewPasswordHash = (await bcrypt.hash(password_hash, 10)) ?? ''
    const result = await context.db.query(
      `UPDATE users SET name=$1,email=$2,password_hash=COALESCE($3, password_hash),status=$4,role_id=$5 WHERE id=$6 RETURNING id,name,email,role_id,status`,
      [name.trim(), email, NewPasswordHash, status, role_id, id]
    )
    const updateUser = result.rows[0]

    if (!updateUser) {
      throwGraphqlError('User not found', 'USER_NOT_FOUND')
    }
    return { updateUserInfo: updateUser }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    ) {
      throwGraphqlError('Email already exists', 'EMAIL_ALREADY_EXISTS')
    }

    throw error
  }
}

export async function updateProfile(
  {
    id,
    name,
    email,
    status,
    password_hash,
  }: Omit<UserInformation, 'role_id'>,
  context: ServerContext
): Promise<UpdateUserResponse> {
  if (id !== context.user.id) {
    throwGraphqlError(
      'You do not have permission to edit other user',
      'FORBIDDEN'
    )
  }

  if (
    !id?.trim() ||
    !name?.trim() ||
    !email?.trim() ||
    !password_hash?.trim() ||
    !status?.trim()
  ) {
    throwGraphqlError('Invalid input data', 'INVALID_INPUT_DATA')
  }

  if (!emailFormatCheck(email)) {
    throwGraphqlError('Email format is invalid', 'EMAIL_FORMAT_INVALID')
  }

  try {
    const NewPasswordHash = (await bcrypt.hash(password_hash, 10)) ?? ''
    const result = await context.db.query(
      `UPDATE users SET name=$1,email=$2,password_hash=COALESCE($3, password_hash),status=$4 WHERE id=$6 RETURNING id,name,email,role_id,status`,
      [name.trim(), email, NewPasswordHash, status, id]
    )
    const updateUser = result.rows[0]

    if (!updateUser) {
      throwGraphqlError('User not found', 'USER_NOT_FOUND')
    }
    return { updateUserInfo: updateUser }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    ) {
      throwGraphqlError('Email already exists', 'EMAIL_ALREADY_EXISTS')
    }
    throw error
  }
}

/**根據權限矩陣 部分role_id擁有更改其他使用者狀態的權限 */
export async function setAdminUserStatus(
  { id, status }: StatusPayload,
  context: ServerContext
): Promise<SetUserStatusResponse> {
  const result = await context.db.query(
    `UPDATE users SET status=$2 WHERE id=$1 RETURNING id,name,email,role_id,status`,
    [id, status]
  )
  return { setUserStatus: result.rows[0] }
}

export async function getAdminUsers(
  context: ServerContext
): Promise<GetUsersResponse> {
  const result = await context.db.query(
    'SELECT users.id,users.name,users.email,users.status,users.create_at,roles.code FROM users INNER JOIN roles ON roles.id = users.role_id WHERE users.role_id > $1',
    [context.user.role_id]
  )
  return { getUsers: result.rows }
}

export async function getAdminUserById(
  userId: string,
  context: ServerContext
): Promise<GetUserByIdResponse> {
  const result = await context.db.query(
    `SELECT users.id,users.name,users.email,users.status,users.create_at,users.role_id FROM users WHERE users.id=$1`,
    [userId]
  )
  return { getUserById: result.rows[0] }
}

export async function getAdminUserByProperties(
  filtersInfo: getUserByPropertiesPayload,
  context: ServerContext
): Promise<GetUserByPropertiesResponse> {
  const keywordValue = filtersInfo.keyword || null
  const statusValue = filtersInfo.status || null
  const isRoleId = filtersInfo.role_id || null

  const result = await context.db.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.status,
      u.create_at,
      r.code
    FROM users AS u
    INNER JOIN roles AS r
      ON r.id = u.role_id
    WHERE
      ($1::text IS NULL OR (
        u.name ILIKE '%' || $1 || '%'
        OR u.email ILIKE '%' || $1 || '%'
        OR u.id::text ILIKE '%' || $1 || '%'
      ))
      AND ($2::bigint IS NULL OR u.role_id = $2)
      AND ($3::text IS NULL OR u.status = $3)
      AND u.role_id > $4
      AND u.id <> $5
  `,
    [keywordValue, isRoleId, statusValue, context.user.role_id, context.user.id]
  )
  return {
    getUsers: result.rows,
  }
}


export async function adminUserLogout(context: ServerContext) {
  context.res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  return {
    success: true,
    message: 'Logout successful',
  }
}

export async function changePassword(id: string, newPassword: string, context: ServerContext): Promise<changePasswordResponse> {

  if (!context.user) {
    throwGraphqlError("Authentication is required", "UNAUTHENTICATED");
  }

  const currentUserRoleId = Number(context.user.role_id);
  /**role id !== 1 不可修改別人的密碼 */
  if (currentUserRoleId !== 1 && id !== context.user.id) {
    throwGraphqlError("You don't have any permission to change admin user password", "FORBIDDEN")
  }
  const NEW_PASSWORD_HASH = await bcrypt.hash(newPassword, 10)
  const result = await context.db.query(`UPDATE users SET password_hash=$1 WHERE id=$2 RETURNING id,name,email,role_id,status`, [NEW_PASSWORD_HASH, id])
  const updatedUser = result.rows[0];

  if (!updatedUser) {
    throwGraphqlError("User not found", "USER_NOT_FOUND");
  }

  return {
    userProfile: updatedUser,
  };

}