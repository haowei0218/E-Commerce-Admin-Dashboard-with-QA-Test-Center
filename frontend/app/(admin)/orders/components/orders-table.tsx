import type { order as Order } from "@/type/orders/base.type";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type HeaderProps = {
  headerName: string;
  style: string;
};

type OrdersTableRowProps = {
  order: Order;
  router: AppRouterInstance;
};

type OrdersTableProps = {
  orders: Order[];
  router: AppRouterInstance;
  headers: HeaderProps[];
};

const orderStatusStyle: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStatusStyle: Record<string, string> = {
  unpaid: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

const shippingStatusStyle: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  preparing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  returned: "bg-purple-100 text-purple-700",
};

const cellClass = "px-4 py-3 align-middle";
const idClass = "block max-w-[180px] truncate text-xs text-gray-500";

function StatusBadge({
  status,
  styles,
}: {
  status: string;
  styles: Record<string, string>;
}) {
  return (
    <span
      className={`inline-flex min-w-[90px] items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ${
        styles[status] ?? "bg-gray-200 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export function OrdersTableRow({ order, router }: OrdersTableRowProps) {
  return (
    <tr className="border-b border-gray-200 transition-colors hover:bg-gray-50">
      <td className={cellClass}>
        <span className={idClass} title={order.id}>{order.id}</span>
      </td>

      <td className={cellClass}>
        <span className="inline-block whitespace-nowrap rounded-md bg-gray-200 px-2 py-1 text-sm text-gray-600">
          {order.order_number}
        </span>
      </td>

      <td className={cellClass}>
        <span className={idClass} title={order.customer_id ?? undefined}>
          {order.customer_id || "—"}
        </span>
      </td>

      <td className={cellClass}>
        <span className="whitespace-nowrap text-sm font-semibold">
          NTD${order.total_amount}
        </span>
      </td>

      <td className={cellClass}>
        <StatusBadge status={order.order_status} styles={orderStatusStyle} />
      </td>

      <td className={cellClass}>
        <StatusBadge status={order.payment_status} styles={paymentStatusStyle} />
      </td>

      <td className={cellClass}>
        <StatusBadge status={order.shipping_status} styles={shippingStatusStyle} />
      </td>

      <td className={cellClass}>
        <span className="whitespace-nowrap text-sm text-gray-600">
          {order.payment_method}
        </span>
      </td>

      <td className={cellClass}>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-blue-500 px-3 text-sm font-bold text-blue-500 hover:cursor-pointer hover:bg-blue-500 hover:text-white"
          onClick={() => router.push(`/orders/details/${order.id}`)}
        >
          Details
        </button>
      </td>
    </tr>
  );
}

export function OrdersTable({ orders, router, headers }: OrdersTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[1150px] table-auto">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(({ headerName }) => (
              <th
                key={headerName}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left text-sm font-bold text-gray-600"
              >
                {headerName}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {orders?.map((order) => (
            <OrdersTableRow key={order.id} order={order} router={router} />
          ))}
        </tbody>
      </table>
    </div>
  );
}