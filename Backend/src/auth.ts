import jwt, { JwtPayload } from 'jsonwebtoken'
import { ServerContext } from './type/user.base.type.js'
import { ContextUserInfo } from './type/user.mutation.type.js'
import { errorMap, throwGraphqlError } from './utils/error.utils.js'
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
  } catch {
    return null
  };
}

/**
 * 檢查操作者是否有權限管理目標使用者
 * @param operatorUser 執行操作的使用者，例如：修改其他使用者帳號狀態的管理員
 * @param targetUserId 被操作的目標使用者 ID，例如：帳號狀態被修改的使用者
 * @param context GraphQL Server Context，包含目前登入者資訊
 * @returns 
 */
export async function requestPermission(targetUserId: string | undefined, context: ServerContext): Promise<{ requireManageUserStatus: boolean }> {
  try {
    if (!targetUserId) return { requireManageUserStatus: false }
    const result = await context.db.query(`SELECT u.id,u.name,u.email,u.role_id,u.status,r.id AS role_code,r.manage_level FROM users AS u INNER JOIN roles AS r ON r.id=u.role_id WHERE u.id=$1`, [targetUserId])
    const targetUser: ContextUserInfo = result.rows[0]
    const operatorUser = context.user

    if (!targetUser) {
      throwGraphqlError(errorMap['USER_NOT_FOUND'], 'USER_NOT_FOUND')
    }

    /**權限不足 OR 使用者id === 目標使用者id 不可操作權限*/
    if (operatorUser.manage_level <= targetUser.manage_level || operatorUser.id === targetUserId) {
      throwGraphqlError(errorMap['FORBIDDEN'], 'FORBIDDEN')
    }
    return { requireManageUserStatus: true }
  } catch (error) {
    console.error('failed to request permission')
    throw error
  }
}