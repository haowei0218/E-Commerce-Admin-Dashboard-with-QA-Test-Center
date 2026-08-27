export const rolePermissions = {
  USERS_CREATE: "users.create",
  USERS_READ: "users.read",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",
  ORDERS_CREATE: "orders.create",
  ORDERS_UPDATE_STATUS: 'orders.update_status',
  ORDERS_UPDATE_PAYMENT_STATUS: 'orders.update_payment_status',
  ORDERS_UPDATE_SHIPPING_STATUS: 'orders.update_shipping_status'
} as const;

export type RolePermission =
  typeof rolePermissions[keyof typeof rolePermissions];