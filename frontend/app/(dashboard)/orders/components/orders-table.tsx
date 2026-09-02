import { formatDate } from "@/lib/utils"
import { order } from "@/type/orders/base.type"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
type orderTableRowProps = {
    order: order
    router: AppRouterInstance
}

type ordersTableProps = {
    orders: order[]
    router: AppRouterInstance
    headers: headersProps[]
}

type headersProps = {
    headerName: string
    style: string
}

const orderStatusStyle = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
}

const paymentStatusStyle = {
    unpaid: 'bg-amber-100 text-amber-700',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-purple-100 text-purple-700',
}

const shippingStatusStyle = {
    pending: 'bg-amber-100 text-amber-700',
    preparing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    returned: 'bg-purple-100 text-purple-700',
}



export function OrdersTableRow(tableRowProps: orderTableRowProps) {
    return (
        <tr
            className='flex gap-2 p-3 border-b border-gray-200'
            key={tableRowProps.order.id + tableRowProps.order.order_number}
        >
            <td className='text-left flex items-center text-md font-medium w-80 font-stretch-condensed'>
                {tableRowProps.order.id.slice(0, 28) + "..."}
            </td>
            <td className='text-left flex items-center text-md font-medium w-45 font-stretch-condensed '>
                {tableRowProps.order.order_number}
            </td>
            <td className='text-left flex items-center text-md font-medium w-60 font-stretch-condensed '>
                {tableRowProps.order.customer_id ? tableRowProps.order.customer_id.slice(0, 28) + "..." : "null"}
            </td>
            <td className='text-left flex items-center text-md font-medium w-40 font-stretch-condensed '>
                NTD${tableRowProps.order.total_amount}
            </td>
            <td
                className="text-left flex items-center text-md font-medium w-30 font-stretch-condensed  "
            >
                <div className={`w-25 h-6 mt-1.5 flex justify-center items-center ${orderStatusStyle[tableRowProps.order.order_status]} rounded-md`}>
                    <span >{tableRowProps.order.order_status}</span>
                </div>
            </td>
            <td
                className="text-left flex items-center text-md font-medium w-30 font-stretch-condensed  "
            >
                <div className={`w-25 h-6 mt-1.5 flex justify-center items-center ${paymentStatusStyle[tableRowProps.order.payment_status]} rounded-md`}>
                    <span >{tableRowProps.order.payment_status}</span>
                </div>
            </td>
            <td
                className="text-left flex items-center text-md font-medium w-50 font-stretch-condensed  "
            >
                <div className={`w-25 h-6 mt-1.5 flex justify-center items-center ${shippingStatusStyle[tableRowProps.order.shipping_status]} rounded-md`}>
                    <span >{tableRowProps.order.shipping_status}</span>
                </div>
            </td>
            <td className='text-left flex items-center text-md font-medium w-50 font-stretch-condensed '>
                {tableRowProps.order.payment_method}
            </td>
            <td className='flex items-start gap-2 text-left text-md font-black font-stretch-condensed mb-2 '>
                <button
                    className='flex items-center justify-center text-white bg-amber-500 p-1 gap-2 rounded-md font-normal border border-gray-200 px-2.5 py-1.5  hover:bg-amber-600'
                    onClick={() => tableRowProps.router.push(`/users/edit-user/${tableRowProps.order.id}`)}
                >
                    Details
                </button>
            </td>
        </tr>)
}

export function OrdersTable(tableProps: ordersTableProps) {
    return (
        <table className='w-full '>
            <thead className='bg-gray-200 rounded-t-2xl'>
                <tr className='flex justify-start gap-2 p-3 '>
                    {
                        tableProps.headers.map((header: headersProps) => {
                            return (
                                <th key={header.headerName} className={`text-left text-sm font-black font-stretch-condensed text-gray-600 ${header.style}`}>
                                    <strong>{header.headerName}</strong>
                                </th>

                            )
                        })
                    }
                </tr>
            </thead>
            <tbody className='bg-white'>
                {tableProps.orders?.map((order) => {
                    return (
                        <OrdersTableRow key={order.id + order.order_number} order={order} router={tableProps.router} />
                    )
                })}
            </tbody>
        </table>
    )
}