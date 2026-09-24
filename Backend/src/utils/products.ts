import { ServerContext } from "../type/admin-users/adminUsers.base..js";
import { filterProductPayload, productPayload, productResponse, productStatus, updateProductDetailsPayload } from "../type/products/products.base.js";
import { throwGraphqlError } from "./error.js";

export async function fetchProducts(payload: filterProductPayload, context: ServerContext) {
    const keywords = payload.keywords ?? null
    const status = payload.status ?? null
    const price = payload.price ?? null

    const page = payload.page > 0 ? payload.page : 1
    const pageSize = payload.pageSize > 0 ? payload.pageSize : 1
    const offset = (page - 1) * pageSize
    const response = await context.db.query(`
    SELECT *
    FROM products
    WHERE
      (
        $1::text IS NULL
        OR product_name ILIKE '%' || $1 || '%'
        OR product_sku ILIKE '%' || $1 || '%'
        OR color ILIKE '%' || $1 || '%'
      )
      AND (
        $2::text IS NULL
        OR status = $2
      )
      AND (
        $3::numeric IS NULL
        OR product_price = $3
      )
    ORDER BY created_at DESC
    LIMIT $4
    OFFSET $5
  `,
        [
            keywords,
            status,
            price,
            pageSize,
            offset,
        ])

    return {
        result: response.rows,
        total_count: response.rowCount,
        page: page,
        pageSize: pageSize
    }
}

export async function fetchProductById(id: string, context: ServerContext): Promise<productResponse> {
    const response = await context.db.query('SELECT * FROM products WHERE id=$1', [id])
    return { result: response.rows[0] }
}

export async function createSingleProduct(payload: productPayload, context: ServerContext) {
    const name = payload.product_name ?? null
    const description = payload.product_description ?? ""
    const image_url = payload.product_image_url ?? null
    const sku = payload.product_sku ?? null
    const price = payload.product_price ?? null
    const color = payload.color ?? ""
    const stock_quantity = payload.stock_quantity ?? 0
    const status = payload.status ?? 'draft'

    if (!name || !image_url || !sku || !price || !stock_quantity) throwGraphqlError('Invalid input data', 'INVALID_INPUT_DATA')

    const response = await context.db.query(`INSERT INTO products (product_name,product_description,product_image_url,product_sku,product_price,color,stock_quantity,status) values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [name, description, image_url, sku, price, color, stock_quantity, status])
    const newProduct = response.rows[0]
    return { result: newProduct }
}

export async function updateProductDetails(
    payload: updateProductDetailsPayload,
    context: ServerContext
) {
    const old_product = await fetchProductById(payload.id, context);

    const name =
        payload.product_name ?? old_product.result.product_name;

    const description =
        payload.product_description ?? old_product.result.product_description;

    const image_url =
        payload.product_image_url ?? old_product.result.product_image_url;

    const sku =
        payload.product_sku ?? old_product.result.product_sku;

    const price =
        payload.product_price ?? old_product.result.product_price;

    const color =
        payload.color ?? old_product.result.color;

    const stock_quantity =
        payload.stock_quantity ?? old_product.result.stock_quantity;

    const status =
        payload.status ?? old_product.result.status;

    const response = await context.db.query(
        `
      UPDATE products
      SET
        product_name = $1,
        product_description = $2,
        product_image_url = $3,
        product_sku = $4,
        product_price = $5,
        color = $6,
        stock_quantity = $7,
        status = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `,
        [
            name,
            description,
            image_url,
            sku,
            price,
            color,
            stock_quantity,
            status,
            payload.id,
        ],
    );

    const updateProduct = response.rows[0];

    return {
        result: updateProduct,
    };
}

export async function updateProductStatus(id: string, status: productStatus , context: ServerContext) {
    const response = await context.db.query('UPDATE products SET status=$2 WHERE id=$1 RETURNING *', [id, status])
    const result = response.rows[0] ?? null
    return { result: result }
}