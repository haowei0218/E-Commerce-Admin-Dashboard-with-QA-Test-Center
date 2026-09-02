import { randomUUID } from "node:crypto";
import { requestAuth } from "../auth.js";
import { ServerContext } from "../type/admin-users/adminUsers.base..js";
import { getOrdersResponse, getOrderStatusResposne, order, orderPayload, orderResponse, orderStatusTransitions, paymentStatusTransitions, shippingStatusTransitions, updateOrderNotePayload, updateOrderNoteResponse, updateOrderRecipientPayload, updateOrderRecipientResponse, updateOrderStatusPayload, updateOrderStatusResponse, updatePaymentStatusPayload, updatePaymentStatusResponse, updateShippingStatusPayload, updateShippingStatusResponse } from "../type/orders/orders.base.js";
import { RolePermission, rolePermissions } from "../type/role-permissions/role_permissions.base.js";
import { throwGraphqlError } from "./error.js";
import { orderFilterPayload } from "../type/orders/orders.base.js";


export function createParameters(count: number) {
    return Array.from({ length: count }, (_, index) => `$${index + 1}`).join(",");
}

export async function getOrderStatus(orderId: string, context: ServerContext): Promise<getOrderStatusResposne> {
    const response = await context.db.query(`SELECT id,payment_status,order_status,shipping_status FROM orders WHERE id=$1`, [orderId])
    return response.rows[0]
}

export async function getOrderItems(orderId: string, context: ServerContext) {
    const order_items_response = await context.db.query(
        `
    SELECT *
    FROM order_items
    WHERE order_id = $1
    ORDER BY created_at ASC
  `, [orderId]
    )

    const order_items = order_items_response.rows
    return order_items
}

export async function checkStatusValidity(context: ServerContext, payload: any, permission: RolePermission, allowStatus: string[], nextStatusTransitions: Record<string, string[]>, statusName: 'payment_status' | 'order_status' | 'shipping_status') {
    await requestAuth(context, permission)
    if (!allowStatus.includes(payload.shipping_status)) {
        throwGraphqlError("Invalid shipping status", "INVALID_INPUT_DATA");
    }
    const orderStatus = await getOrderStatus(payload.id, context)
    const nextStatus = nextStatusTransitions[orderStatus[statusName]] ?? []

    if (!nextStatus.includes(payload[statusName])) {
        throwGraphqlError(`Cannot change shipping status from ${orderStatus[statusName]} to ${payload[statusName]}`, 'INVALID_INPUT_DATA')
    }
}

export async function createOrder(
    payload: orderPayload,
    context: ServerContext,
): Promise<orderResponse> {
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
        payment_method
    } = payload;
    await requestAuth(context, rolePermissions.ORDERS_CREATE);
    const sqlParameters = createParameters(11)

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
            note,
            payment_method
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
                payment_method

            ],
        );
        const order_details = response.rows[0] ?? null;
        if (!order_details) {
            throw new Error("Create order failed");
        }


        const orderItemValues: unknown[] = [];

        const orderItemPlaceholders = order_items
            .map((item, index) => {
                const baseIndex = index * 8;

                const itemTotalAmount = item.price * item.purchase_quantity;

                orderItemValues.push(
                    order_details.id,
                    item.product_id ?? null,
                    item.sku ?? null,
                    item.product_name,
                    item.product_image_url ?? null,
                    item.purchase_quantity,
                    item.price,
                    itemTotalAmount,
                );

                return `(
                    $${baseIndex + 1},
                    $${baseIndex + 2},
                    $${baseIndex + 3},
                    $${baseIndex + 4},
                    $${baseIndex + 5},
                    $${baseIndex + 6},
                    $${baseIndex + 7},
                    $${baseIndex + 8}
                )`;
            })
            .join(",");

        const created_order_items_response = await client.query(
                /* sql */ `
                    INSERT INTO order_items (
                        order_id,
                        product_id,
                        sku,
                        product_name,
                        product_image_url,
                        purchase_quantity,
                        price,
                        total_amount
                    )
                    VALUES ${orderItemPlaceholders}
                    RETURNING *
                `,
            orderItemValues,
        );
        const created_order_items = created_order_items_response.rows
        await client.query("COMMIT");
        return { details: { ...order_details, order_items: created_order_items } };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function updateOrderStatus(payload: updateOrderStatusPayload, context: ServerContext): Promise<updateOrderStatusResponse> {
    await requestAuth(context, rolePermissions.ORDERS_UPDATE_STATUS)


    /**先驗證訂單狀態 才可以更改狀態 */
    const checkOrderStatus = await getOrderStatus(payload.id, context)

    /**檢查狀態 */
    const allow_status = ['pending', 'processing', 'cancelled', 'completed']
    if (!allow_status.includes(payload.order_status)) {
        throwGraphqlError('Invalid Input Data', 'INVALID_INPUT_DATA')
    }

    /**要更新程某個狀態 需要符合條件 以下為檢查條件*/
    const nextStatus = orderStatusTransitions[checkOrderStatus.order_status] ?? []
    if (!nextStatus.includes(payload.order_status)) {
        throwGraphqlError(`Cannot change order status from ${checkOrderStatus.order_status} to ${payload.order_status}`, 'INVALID_INPUT_DATA')
    }

    if (
        payload.order_status === "completed" &&
        checkOrderStatus.payment_status !== "paid"
    ) {
        throwGraphqlError(
            "Order cannot be completed before payment is paid",
            "INVALID_INPUT_DATA",
        );
    }

    if (
        payload.order_status === "completed" &&
        checkOrderStatus.shipping_status !== "delivered"
    ) {
        throwGraphqlError(
            "Order cannot be completed before delivery",
            "INVALID_INPUT_DATA",
        );
    }

    if (
        payload.order_status === "cancelled" &&
        !payload.cancel_reason?.trim()
    ) {
        throwGraphqlError(
            "Cancel reason is required",
            "INVALID_INPUT_DATA",
        );
    }

    if (
        payload.order_status === "cancelled" &&
        checkOrderStatus.shipping_status === "delivered"
    ) {
        throwGraphqlError(
            "Delivered order cannot be cancelled. Please use return flow instead.",
            "INVALID_INPUT_DATA",
        );
    }


    /**CASE
        WHEN 條件成立 THEN 要使用的值
        ELSE 條件不成立時使用的值
        END */

    const order_update_response = await context.db.query( /* sql */ `
    UPDATE orders
    SET
      order_status = $2,
      cancel_reason = CASE
        WHEN $2 = 'cancelled' THEN $3
        ELSE cancel_reason
      END,
      cancelled_at = CASE
        WHEN $2 = 'cancelled' THEN NOW()
        ELSE cancelled_at
      END,
      completed_at = CASE
        WHEN $2 = 'completed' THEN NOW()
        ELSE completed_at
      END,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `, [payload.id, payload.order_status, payload.cancel_reason ?? null])
    const order_update_details = order_update_response.rows[0]
    if (!order_update_details) {
        throwGraphqlError("Order not found", "ORDER_NOT_FOUND");
    }
    const order_item = await getOrderItems(payload.id, context)
    return { updateDetails: { ...order_update_details, order_items: order_item } }
}

export async function updatePaymentStatus(payload: updatePaymentStatusPayload, context: ServerContext): Promise<updatePaymentStatusResponse> {
    await requestAuth(context, rolePermissions.ORDERS_UPDATE_PAYMENT_STATUS)
    const allowPaymentStatus = ["unpaid", "paid", "failed", "refunded"];
    if (!allowPaymentStatus.includes(payload.payment_status)) {
        throwGraphqlError("Invalid payment status", "INVALID_INPUT_DATA");
    }
    const orderStatus = await getOrderStatus(payload.id, context)
    const nextPaymentStatus = paymentStatusTransitions[orderStatus.payment_status] ?? []
    if (!nextPaymentStatus.includes(payload.payment_status)) {
        throwGraphqlError(`Cannot change payment status from ${orderStatus.payment_status} to ${payload.payment_status}`, 'INVALID_INPUT_DATA')
    }

    if (orderStatus.order_status == 'cancelled' && payload.payment_status !== "refunded") {
        throwGraphqlError(
            "Cancelled order can only update payment status to refunded",
            "INVALID_INPUT_DATA",
        );
    }
    if (
        orderStatus.shipping_status === 'return' &&
        payload.payment_status !== "refunded"
    ) {
        throwGraphqlError(
            "Returned order can only update payment status to refunded",
            "INVALID_INPUT_DATA",
        );
    }


    const update_payment_status_response = await context.db.query(
        `UPDATE orders 
      SET 
        payment_status = $2,
        paid_at = CASE
          WHEN $2 = 'paid' THEN NOW()
          ELSE paid_at
        END,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *  
           `, [payload.id, payload.payment_status])
    const update_payment_status_details = update_payment_status_response.rows[0]
    if (!update_payment_status_details) {
        throwGraphqlError('Order not found', 'ORDER_NOT_FOUND')
    }
    const order_item = await getOrderItems(payload.id, context)
    return {
        updatePaymentDetails: {
            ...update_payment_status_details, order_items: order_item
        }
    }
}

export async function updateShippingStatus(payload: updateShippingStatusPayload, context: ServerContext): Promise<updateShippingStatusResponse> {
    const allowedStatus = ['pending', 'preparing', 'shipped', 'delivered', 'return']
    await checkStatusValidity(context, payload, rolePermissions.ORDERS_UPDATE_SHIPPING_STATUS, allowedStatus, shippingStatusTransitions, 'shipping_status')
    const update_shipping_status_response = await context.db.query(`
        UPDATE orders 
            SET 
                shipping_status=$2, 
                updated_at = NOW()
            WHERE id=$1
            RETURNING *`, [payload.id, payload.shipping_status])

    if (!update_shipping_status_response) {
        throwGraphqlError('Order not found', 'ORDER_NOT_FOUND')
    }
    const order_items = await getOrderItems(payload.id, context)

    return {
        updateShippingDetails: { ...update_shipping_status_response.rows[0], order_items: order_items }
    }

}

export async function updateOrderRecipient(payload: updateOrderRecipientPayload, context: ServerContext): Promise<updateOrderRecipientResponse> {
    await requestAuth(context, rolePermissions.ORDERS_UPDATE_RECIPIENT)
    const { recipient_name, recipient_phone, shipping_address, shipping_city, shipping_district, shipping_zip_code, id } = payload
    const response = await context.db.query('UPDATE orders SET recipient_name=$2,recipient_phone=$3,shipping_city=$4,shipping_district=$5,shipping_address=$6,shipping_zip_code=$7 WHERE id=$1 RETURNING *', [id, recipient_name, recipient_phone, shipping_city, shipping_district, shipping_address, shipping_zip_code])
    const update_order_recipient_result = response.rows[0]

    if (!update_order_recipient_result) {
        throwGraphqlError('Order not found', 'ORDER_NOT_FOUND')
    }
    const order_items = await getOrderItems(payload.id, context)
    return {
        updateOrderRecipientDetails: { ...update_order_recipient_result, order_items: order_items }
    }
}

export async function getAllOrders(context: ServerContext) {
    const response = await context.db.query('SELECT * FROM orders')
    return { all: response.rows, total_count: response.rowCount }
}

export async function getOrders(payload: orderFilterPayload, context: ServerContext): Promise<getOrdersResponse> {
    if (payload.order_status && !Object.keys(orderStatusTransitions).includes(payload.order_status)) {
        throwGraphqlError("Invalid order status", "INVALID_INPUT_DATA");
    }

    if (payload.payment_status && !Object.keys(paymentStatusTransitions).includes(payload.payment_status)) {
        throwGraphqlError("Invalid payment status", "INVALID_INPUT_DATA");
    }

    if (payload.shipping_status && !Object.keys(shippingStatusTransitions).includes(payload.shipping_status)) {
        throwGraphqlError("Invalid shipping status", "INVALID_INPUT_DATA");
    }

    const page = payload?.page && payload.page > 0 ? payload.page : 1;
    const pageSize =
        payload?.pageSize && payload.pageSize > 0 ? payload.pageSize : 10;

    const offset = (page - 1) * pageSize;

    const params = [
        payload.keyword ?? null,
        payload.order_status ?? null,
        payload.payment_status ?? null,
        payload.shipping_status ?? null,
        payload.date_from ?? null,
        payload.date_to ?? null,
        pageSize,
        offset
    ]
    const countResult = await context.db.query(
        `
  SELECT COUNT(*) AS total
  FROM orders
  WHERE
    (
      $1::text IS NULL
      OR id::text ILIKE '%' || $1 || '%'
      OR order_number ILIKE '%' || $1 || '%'
      OR recipient_name ILIKE '%' || $1 || '%'
      OR recipient_phone ILIKE '%' || $1 || '%'
      OR shipping_city ILIKE '%' || $1 || '%'
      OR shipping_district ILIKE '%' || $1 || '%'
    )
    AND ($2::text IS NULL OR order_status = $2)
    AND ($3::text IS NULL OR payment_status = $3)
    AND ($4::text IS NULL OR shipping_status = $4)
    AND ($5::timestamptz IS NULL OR created_at >= $5)
    AND ($6::timestamptz IS NULL OR created_at <= $6)
  `,
        params.slice(0, 6)
    );

    const response = await context.db.query(`
        /* sql */ 
    SELECT *
    FROM orders
    WHERE
      (
        $1::text IS NULL
        OR id::text ILIKE '%' || $1 || '%'
        OR order_number ILIKE '%' || $1 || '%'
        OR recipient_name ILIKE '%' || $1 || '%'
        OR recipient_phone ILIKE '%' || $1 || '%'
        OR shipping_city ILIKE '%' || $1 || '%'
        OR shipping_district ILIKE '%' || $1 || '%'
      )
      AND ($2::text IS NULL OR order_status = $2)
      AND ($3::text IS NULL OR payment_status = $3)
      AND ($4::text IS NULL OR shipping_status = $4)
      AND ($5::timestamptz IS NULL OR created_at >= $5)
      AND ($6::timestamptz IS NULL OR created_at <= $6)

      ORDER BY created_at DESC
    LIMIT $7
    OFFSET $8
  `,
        params
    )
    const result = response.rows
    const total = countResult.rows[0].total
    const total_page = Math.ceil(total / pageSize)
    return {
        getOrders: result,
        total_count: total_page,
        page: page,
        pageSize: pageSize
    }
}

export async function getOrderById(id: string, context: ServerContext) {
    const response = await context.db.query(`SELECT id,order_number,customer_id,shipping_fee,total_amount,order_status,payment_status,shipping_status,recipient_name,recipient_phone,shipping_city,shipping_district,shipping_address,shipping_zip_code,note,paid_at,completed_at,cancelled_at,cancel_reason,created_at,updated_at,payment_method FROM orders WHERE id=$1`, [id])
    const result = response.rows
    const order_items = await getOrderItems(id, context)

    return {
        getOrdersById: [{ ...result[0], order_items: order_items }]
    }
}

export async function updateOrderNote(payload: updateOrderNotePayload, context: ServerContext): Promise<updateOrderNoteResponse> {
    const updateOrderNoteResponse = await context.db.query(`UPDATE orders SET note=$2 WHERE id=$1 RETURNING *`, [payload.id, payload.note])
    const order_details = updateOrderNoteResponse.rows[0]
    const order_items = await getOrderItems(payload.id, context)
    return { updateOrderNoteDetails: { ...order_details, order_items: order_items } }
}