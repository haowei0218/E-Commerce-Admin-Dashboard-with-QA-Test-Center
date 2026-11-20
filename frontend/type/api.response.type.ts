import { UserLoginResponse, GetUsersResponse, AdminUserLogoutResponse, GetAdminUserByPropertiesResponse, CreateAdminUserResponse, GetAdminUserByIdResponse, UpdateMyProfileResponse, ChangePasswordResponse, SetAdminUserRoleResponse, SetAdminUserActiveResponse, SetAdminUserInactiveResponse, GetAdminUserTimeLineResponse, GetAdminUserStatisticsResponse } from './admin-users/adminUser.type'
import { orderEventResponse, } from './order-event/base.type'
import { getAllOrdersResponse, getOrdersResponse, getOrderByIdResponse, updateOrderStatusResponse, updatePaymentStatusResponse, updateShippingStatusResponse, updateOrderNoteResponse, GetOrdersStatisticsResponse } from './orders/base.type'
import { productResponse, getProductsResponse, createImageUrlToken, updateProductDetailsResponse, getProductByIdResponse, updateProductStatusResponse } from './products/products.base'
import { activityLogResponse } from './acitve-log/activitylog.base'
export type Response = {
  UserLogin: UserLoginResponse
  GetUsers: GetUsersResponse
  AdminUserLogout: AdminUserLogoutResponse
  GetAdminUserByProperties: GetAdminUserByPropertiesResponse
  CreateAdminUser: CreateAdminUserResponse
  GetAdminUserById: GetAdminUserByIdResponse
  UpdateMyProfile: UpdateMyProfileResponse
  ChangePassword: ChangePasswordResponse
  SetAdminUserRole: SetAdminUserRoleResponse
  SetAdminUserActive: SetAdminUserActiveResponse
  SetAdminUserInactive: SetAdminUserInactiveResponse
  GetAllOrders: getAllOrdersResponse
  GetOrders: getOrdersResponse
  GetOrderById: getOrderByIdResponse
  UpdateOrderStatus: updateOrderStatusResponse
  UpdatePaymentStatus: updatePaymentStatusResponse
  UpdateShippingStatus: updateShippingStatusResponse
  UpdateOrderNote: updateOrderNoteResponse
  GetOrderEvent: orderEventResponse
  GetProducts: getProductsResponse
  CreateProduct: productResponse
  UpdateProductDetails: updateProductDetailsResponse
  UpdateProductStatus: updateProductStatusResponse
  GetProductById: getProductByIdResponse
  GetImageToken: createImageUrlToken
  GetActiveLog: activityLogResponse
  GetAdminUserTimeLine: GetAdminUserTimeLineResponse
  GetAdminUserStatistics: GetAdminUserStatisticsResponse
  GetOrdersStatistics: GetOrdersStatisticsResponse


}
