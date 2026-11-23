import { filterProductPayload } from "../../type/products/products.base.js";
import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { fetchProductById, fetchProducts, fetchProductsStatistics } from "../../utils/products.js";
export const ProductsQueryResolvers = {
    Query: {
        getProducts: async (_parent: unknown, { input }: { input: filterProductPayload }, context: ServerContext) => {
            return await fetchProducts(input, context)
        },
        getProductById: async (_parent: unknown, { id }: { id: string }, context: ServerContext) => {
            return await fetchProductById(id, context)
        },
        getProductsStatistics: async (_parent: unknown, { }, context: ServerContext) => {
            return await fetchProductsStatistics(context)
        },
        

    }
}