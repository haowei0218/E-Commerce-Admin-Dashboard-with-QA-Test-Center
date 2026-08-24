export const rolePermissions = {
  USERS_CREATE: "users.create",
  USERS_READ: "users.read",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",
  ORDERS_CREATE:"orders.create"
} as const;

export type RolePermission =
  typeof rolePermissions[keyof typeof rolePermissions];