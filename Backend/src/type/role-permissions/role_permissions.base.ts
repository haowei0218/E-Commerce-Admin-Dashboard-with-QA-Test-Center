export const rolePermissions = {
  USERS_CREATE: "users.create",
  USERS_READ: "users.read",
  USERS_DELETE: "users.delete",
  USERS_UPDATE_BASIC_INFORMATION: 'users.update_basic_information',
  USERS_UPDATE_STATUS: 'users.update_status',
  USERS_UPDATE_ROLE: 'users.update_role',
  USERS_CHANGE_PASSWORD: 'users.change_password',
  ORDERS_CREATE: "orders.create",
  ORDERS_UPDATE_STATUS: 'orders.update_status',
  ORDERS_UPDATE_PAYMENT_STATUS: 'orders.update_payment_status',
  ORDERS_UPDATE_SHIPPING_STATUS: 'orders.update_shipping_status',
  ORDERS_UPDATE_RECIPIENT: 'orders.update_recipient',
  ORDERS_UPDATE_NOTE: 'orders.update_note',
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_UPDATE_STATUS: 'products.update_status',
  PRODUCTS_UPDATE_DETAILS: 'products.update_details',
  PRODUCTS_READ: 'products.read',
  PRODUCTS_ARCHIVE: 'products.archive'
} as const;

export type RolePermission =
  typeof rolePermissions[keyof typeof rolePermissions];