import {
  userLoginPayload,
  UserLoginResponse,
  GetUsersResponse,
  GetUserByIdResponse,
  GetUserByPropertiesResponse,
  getUserByPropertiesPayload,
} from '../type/admin-users/adminUser.query.js'
import { GraphQLError } from 'graphql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { throwGraphqlError } from './error.js'
import { env } from '../env.local.js'
import {
  SetUserStatusResponse,
  RegisterUserResponse,
  UpdateUserResponse,
  UserInformation,
  StatusPayload,
  changePasswordResponse,
  updateMyProfilePayload,
  updateMyProfileResponse,
  setAdminUserRoleResponse,
} from '../type/admin-users/adminUser.mutation.js'
import { RoleCode, ServerContext } from '../type/admin-users/adminUsers.base..js'
import { requestPermission, requestAuth } from '../auth.js'
import { rolePermissions } from '../type/role-permissions/role_permissions.base.js'

/**email format check */
export function emailFormatCheck(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function userLogin(
  { account, password }: userLoginPayload,
  context: ServerContext
): Promise<UserLoginResponse> {
  const result = await context.db.query(
    `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.password_hash,
      u.role_id,
      u.status,
      u.create_at,
      r.code,
      r.manage_level,

      COALESCE(
        ARRAY_AGG(p.code) FILTER (WHERE p.code IS NOT NULL),
        ARRAY[]::text[]
      ) AS permissions

    FROM users AS u
    INNER JOIN roles AS r
      ON r.id = u.role_id

    LEFT JOIN role_permissions AS rp
      ON rp.role_id = r.id

    LEFT JOIN permissions AS p
      ON p.id = rp.permission_id

    WHERE LOWER(u.email) = LOWER($1)

    GROUP BY 
      u.id,
      u.name,
      u.email,
      u.password_hash,
      u.role_id,
      u.status,
      u.create_at,
      r.code,
      r.manage_level
  `,
    [account.trim().toLowerCase()]
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
    throw new GraphQLError('帳號已停用 請聯繫管理員', {
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
      expiresIn: '2h',
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
      manage_level: user.manage_level,
      permissions: user.permissions
    },
    token: token,
  }
}

export async function createAdminUser(
  { name, email, password_hash, role_id, status }: UserInformation,
  context: ServerContext
): Promise<RegisterUserResponse> {
  try {
    requestAuth(context, rolePermissions.USERS_CREATE)
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
/**根據權限矩陣 部分role_id擁有更改其他使用者狀態的權限 */
export async function setAdminUserStatus(
  { id, status }: StatusPayload,
  context: ServerContext
): Promise<SetUserStatusResponse> {
  await requestAuth(context, rolePermissions.USERS_UPDATE)
  const result = await context.db.query(
    `UPDATE users SET status=$2 WHERE id=$1 RETURNING id,name,email,role_id,status`,
    [id, status]
  )
  return { setUserStatus: result.rows[0] }
}

export async function getAdminUsers(
  context: ServerContext
): Promise<GetUsersResponse> {
  await requestAuth(context, rolePermissions.USERS_READ)
  const result = await context.db.query(
    'SELECT users.id,users.name,users.email,users.status,users.create_at,roles.code FROM users INNER JOIN roles ON roles.id = users.role_id WHERE roles.manage_level < $1 OR users.id = $2',
    [context.user.manage_level, context.user.id]
  )
  return { getUsers: result.rows }
}

export async function getAdminUserById(
  userId: string,
  context: ServerContext
): Promise<GetUserByIdResponse> {
  await requestAuth(context, rolePermissions.USERS_READ)
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
  await requestAuth(context, rolePermissions.USERS_READ)
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
  await requestAuth(context, rolePermissions.USERS_UPDATE)
  if (id.length === 0 || newPassword.length === 0) {
    throwGraphqlError('Invalid input data', "INVALID_INPUT_DATA")
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

export async function updateMyProfile(myProfile: updateMyProfilePayload, context: ServerContext): Promise<updateMyProfileResponse> {
  await requestAuth(context, rolePermissions.USERS_UPDATE)
  const { email, name } = myProfile
  if (email.length === 0 || name.length === 0) {
    throwGraphqlError('Invalid input data', "INVALID_INPUT_DATA")
  }

  const isSelf = myProfile.id === context.user.id
  const currentManageLevel = Number(context.user.manage_level)
  const currentRoleId = Number(context.user.role_id)
  const canManageOtherUser = [1, 2, 6].includes(currentRoleId)

  /**如果不是自己且又不是高權限帳號  要驗證權限是否比較高*/
  if (!isSelf && !canManageOtherUser) {
    const result = await context.db.query(`SELECT id,manage_level FROM users WHERE id=$1`, [myProfile.id])
    const targetUser = result.rows[0]

    if ((Number(targetUser.manage_level) >= currentManageLevel)) {
      throwGraphqlError("You don't have any permission to change admin user password", "FORBIDDEN")
    }
  }
  const result = await context.db.query(`UPDATE users AS u SET name=$1,email=$2 FROM roles AS r WHERE u.id=$3 AND u.role_id=r.id RETURNING u.id,u.name,u.email,u.status,u.create_at,r.code`, [myProfile.name, myProfile.email, myProfile.id])
  const updateMyProfile = result.rows[0]
  return {
    userProfile: updateMyProfile
  }
}

/**更新使用者帳號的狀態 */
export async function setAdminUserRole(id: string | undefined, role_id: RoleCode, context: ServerContext): Promise<setAdminUserRoleResponse> {
  await requestAuth(context, rolePermissions.USERS_UPDATE)
  const requestPermissions = requestPermission(id, context)
  if (!requestPermissions) {
    throwGraphqlError("You don't have any permission to change admin user password", "FORBIDDEN")
  }

  const result = await context.db.query(`UPDATE users AS u SET role_id=$1 FROM roles AS r WHERE u.id=$2 AND r.id=$1 RETURNING u.id,u.name,u.email,u.status,u.create_at,r.code`, [role_id, id])
  return {
    userProfile: result.rows[0]
  }
}