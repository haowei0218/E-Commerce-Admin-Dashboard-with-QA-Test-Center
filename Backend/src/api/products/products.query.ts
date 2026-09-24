import { filterProductPayload } from "../../type/products/products.base.js";
import { ServerContext } from "../../type/admin-users/adminUsers.base..js";
import { fetchProductById, fetchProducts } from "../../utils/products.js";
export const ProductsQueryResolvers = {
    Query: {
        getProducts: async (_parent: unknown, { input }: { input: filterProductPayload }, context: ServerContext) => {
            return await fetchProducts(input, context)
        },
        getProductById: async (_parent: unknown, { id }: { id: string }, context: ServerContext) => {
            return await fetchProductById(id, context)
        }
    }
}