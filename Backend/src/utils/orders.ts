import { randomUUID } from "node:crypto";
import { requestAuth } from "../auth.js";
import { ServerContext } from "../type/admin-users/adminUsers.base..js";
import { orderPayload } from "../type/orders/orders.base.js";
import { rolePermissions } from "../type/role-permissions/role_permissions.base.js";

export function createParameters(count: number) {
    return Array.from({ length: count }, (_, index) => `$${index + 1}`).join(",");
}

export async function createOrder(
    payload: orderPayload,
    context: ServerContext,
) {
    const { db } = context;
    const {
        customer_id,
        recipient_name,
        recipient_phone,
        shipping_city,
        shipping_district,
        shipping_address,
        shipping_zip_code,
        note,
        order_items,
    } = payload;
    await requestAuth(context, rolePermissions.ORDERS_CREATE);
    const sqlParameters = createParameters(10)

    /**後端自行產生的參數 */
    const shipping_fee = 60;
    const total_amount = order_items.map((item) => item.price * item.purchase_quantity).reduce((a, b) => a + b) + shipping_fee
    const order_number = `ORD-${new Date().toISOString().split('T')[0]}-${randomUUID().slice(0, 9)}`

    /**db */
    const client = await db.connect();

    try {
        await client.query("BEGIN");
        const response = await db.query(
    /* sql */ `
        INSERT INTO orders (
            order_number,
            customer_id,
            total_amount,
            recipient_name,
            recipient_phone,
            shipping_city,
            shipping_district,
            shipping_address,
            shipping_zip_code,
            note
        )
        VALUES (${sqlParameters}) RETURNING *
        `,
            [
                order_number,
                customer_id,
                total_amount,
                recipient_name,
                recipient_phone,
                shipping_city,
                shipping_district,
                shipping_address,
                shipping_zip_code,
                note,
            ],
        );
        const order_details = response.rows[0] ?? null;
        if (!order_details) {
            throw new Error("Create order failed");
        }

        const orderItemsParameters = createParameters(8)
        const created_order_items = []
        for (const item of order_items) {
            const item_total_amount = item.price * item.purchase_quantity
            const itemResponse = await client.query(/**sql */ `
                    INSERT INTO order_items
                    (
                        order_id,
                        product_id,
                        sku,
                        product_name,
                        product_image_url,
                        purchase_quantity,
                        price,
                        total_amount
                    ) 
                    values (${orderItemsParameters}) RETURNING *`, [order_details.id, item.product_id ?? null, item.sku ?? null, item.product_name, item.product_image_url ?? null, item.purchase_quantity, item.price, item_total_amount]);
            created_order_items.push(itemResponse.rows[0]);
        }
        await client.query("COMMIT");
        return { details: { ...order_details, order_items: created_order_items } };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
