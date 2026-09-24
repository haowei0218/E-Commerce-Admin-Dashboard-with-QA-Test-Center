import { create } from "node:domain";
import { createProductResponse } from "../../schema/products/product.type.js";
import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { productPayload, productResponse, updateProductDetailsPayload, updateProductStatusPayload } from "../../type/products/products.base.js";
import { createActivityLog } from "../../utils/activity-log.js";
import { createSingleProduct, fetchProductById, updateProductDetails, updateProductStatus } from "../../utils/products.js";

export const ProductsMutationResolvers = {
    Mutation: {
        createProduct: async (_parent: unknown, { input }: { input: productPayload }, context: ServerContext) => {
            const response: productResponse = await createSingleProduct(input, context)
            console.log(response)
            if (response) await createActivityLog({ user_id: context.user.id, action: 'CREATE', description: `使用者${context.user.name} 新增產品:${input.product_name} 產品編號:${response.result.id}`, module: "products" }, context)
            return response
        },
        updateProductDetails: async (_parent: unknown, { input }: { input: updateProductDetailsPayload }, context: ServerContext) => {
            const result: productResponse = await updateProductDetails(input, context)
            if (result) await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `使用者${context.user.name} 更新產品:${input.product_name} 產品編號:${result.result.id}`, module: "products" }, context)
            return result
        },
        updateProductStatus: async (_parent: unknown, { input }: { input: updateProductStatusPayload }, context: ServerContext) => {
            const product = await fetchProductById(input.id, context)
            const update_status = await updateProductStatus(input.id, input.status, context)

            if (update_status) await createActivityLog({ user_id: context.user.id, action: 'UPDATE', description: `使用者${context.user.name} 更新產品狀態:${product.result.status} => ${input.status} 產品編號:${input.id}`, module: "products" }, context)

            return update_status
        }
    }
}