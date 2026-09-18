'use client'
import { useParams } from "next/navigation";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";
import { FaLongArrowAltDown, FaLongArrowAltLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import { order, orderItems } from "@/type/orders/base.type";
import { getOrderById } from "@/lib/orders.api";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { OrderItemCard } from "../../components/order-item-card";
import { randomKey } from "@/lib/utils";
import { LuMapPin } from "react-icons/lu";
import { FaCcAmazonPay } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import Breadcrumbs from "@/app/(admin)/users/components/breadcrumbs";


const shippingStatusStyle = {
    pending: 'bg-amber-100 text-amber-700',
    preparing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    returned: 'bg-purple-100 text-purple-700',
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


export default function OrderDetails() {
    const params = useParams<{ id: string }>()
    const orderId = params.id ?? ""
    const [createOrderDate, setCreateOrderDate] = useState("")
    const [orderItemsDisplay, setorderItemsDisplay] = useState<boolean>(false)

    const getOrderByIdQuery = useQuery({
        queryKey: ['order-by-id'],
        queryFn: () => getOrderById(orderId),
        enabled: Boolean(orderId)
    })
    const orderDetails = getOrderByIdQuery.data?.getOrderById.result
    const orderItems = orderDetails?.order_items ?? []
    const orderItemsHeight = String((25 * orderItems.length) + 20)
    const shippingInformation = {
        recipient_name: orderDetails?.recipient_name,
        recipient_phone: orderDetails?.recipient_phone,
        shipping_city: orderDetails?.shipping_city,
        shipping_district: orderDetails?.shipping_district,
        shipping_address: orderDetails?.shipping_address,
        shipping_zip_code: orderDetails?.shipping_zip_code,
        note: orderDetails?.note,
        shipping_status: orderDetails?.shipping_status ?? "pending"
    }
    const paymentInformation = {
        payment_status: orderDetails?.payment_status ?? 'unpaid',
        payment_method: orderDetails?.payment_method
    }
    const orderTotalAmount = orderItems.map((item) => Number(item.purchase_quantity) * item.price).reduce((a, b) => a + b, 0) ?? 0

    // order time line = create + process(order status) + shipped + delivered(shipping status)
    const orderTimeLine = {
        create_at: orderDetails?.created_at,
        process_at:orderDetails?.created_at,
        shipped_at:"",
        delivered_at:""
    }


    return (
        <div className='bg-gray-50 w-full h-full p-10 overflow-y-auto'>
            <div className="flex justify-between items-center">
                <div className="flex flex-col justify-center items-start gap-5">
                    <Breadcrumbs action="Orders Details" route="orders" />
                    <h1 className='text-3xl font-bold'>
                        View Details
                    </h1>
                    <div className="flex items-center">
                        <div className="h-5 flex justify-start items-center border-r border-r-gray-400 pr-4">
                            <span className='text-gray-500 text-md font-medium'>
                                {`order ID - ${params.id}`}
                            </span>
                        </div>

                        <div className="h-5 flex justify-start items-center border-l border-l-gray-400 pl-4">
                            <span className='text-gray-500 text-md font-medium'>
                                {`create by ${formatDate(createOrderDate) ?? ""}`}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="flex w-50 h-15 justify-center items-center gap-2 hover:bg-gray-300 hover:cursor-pointer border-2 border-gray-300 rounded-lg bg-white" >
                    <FaLongArrowAltLeft className="font-normal text-black" />
                    <Link href='/orders' className="text-lg font-normal text-black">Back to orders</Link>
                </button>
            </div>


            {/* order items */}
            <div className={`flex flex-col gap-4 mt-10 bg-white w-210 border border-gray-200 rounded-lg p-4`}>
                <h1 className="font-extrabold text-lg">Items({orderDetails?.order_items.length ?? 0})</h1>
                <div className={`py-5 gap-5 ${orderItemsHeight} flex flex-col`}>
                    {orderItemsDisplay ? orderItems?.map((orderItem: orderItems) => <OrderItemCard key={randomKey()} orderDetails={orderItem} />) : orderItems?.slice(0, 3).map((orderItem: orderItems) => <OrderItemCard key={String(Math.floor(Math.random() * 999999))} orderDetails={orderItem} />)}
                    <div className={`w-full ${orderItems.length > 3 ? "" : 'hidden'}`} onClick={() => setorderItemsDisplay(!orderItemsDisplay)}>
                        <button className="w-20 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-white hover:bg-gray-500 hover:text-white m-auto" >show all</button>
                    </div>
                </div>
            </div>

            {/* Shipping information */}
            <div className="flex flex-col gap-4 mt-5 bg-white w-210 border border-gray-200 rounded-lg p-4">
                <h1 className="font-extrabold text-lg">Shipping Information</h1>
                <div className="flex gap-4 justify-start items-start">
                    <LuMapPin size={30} />

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">{shippingInformation.recipient_name}</span>
                        <span className="text-sm font-normal">{shippingInformation.recipient_phone}</span>
                        <span className="text-sm font-normal">{shippingInformation.shipping_address} , {shippingInformation.shipping_district}</span>
                        <span className="text-sm font-normal">{shippingInformation.shipping_city}</span>
                    </div>

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Shipping Status</span>
                        <div className={`w-25 h-8  flex justify-center items-center rounded-2xl text-sm font-bold ${shippingStatusStyle[shippingInformation.shipping_status]}`}>
                            <span >{shippingInformation.shipping_status}</span>
                        </div>
                    </div>

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Note</span>
                        <span >{shippingInformation.note ?? "note is empty"}</span>
                    </div>
                </div>
            </div>

            {/* Payment information */}
            <div className="flex flex-col gap-4 mt-5 bg-white w-210 border border-gray-200 rounded-lg p-4">
                <h1 className="font-extrabold text-lg">Payment Information</h1>
                <div className="flex gap-4 justify-start items-start">
                    <IoWalletOutline size={30} />

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Payment method</span>
                        <span className="text-sm font-normal">{paymentInformation.payment_method}</span>
                    </div>

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Payment status</span>
                        <div className={`w-25 h-8  flex justify-center items-center rounded-2xl text-sm font-bold ${paymentStatusStyle[paymentInformation.payment_status]}`}>
                            <span >{paymentInformation.payment_status}</span>
                        </div>
                    </div>

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Total</span>
                        <span className="text-sm font-normal">NTD$ {orderTotalAmount}</span>
                    </div>
                </div>
            </div>


            {/* Order TimeLine*/}
            <div className="flex flex-col gap-4 mt-5 bg-white w-210 border border-gray-200 rounded-lg p-4">
                <h1 className="font-extrabold text-lg">Payment Information</h1>
                <div className="flex gap-4 justify-start items-start">

                    <div >

                        <div className="flex items-center gap-4">
                            <FaCheckCircle className="text-green-600" size={30} />
                            <span>{ }</span>
                        </div>

                    </div>


                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Payment method</span>
                        <span className="text-sm font-normal">{paymentInformation.payment_method}</span>
                    </div>

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Payment status</span>
                        <div className={`w-25 h-8  flex justify-center items-center rounded-2xl text-sm font-bold ${paymentStatusStyle[paymentInformation.payment_status]}`}>
                            <span >{paymentInformation.payment_status}</span>
                        </div>
                    </div>

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Total</span>
                        <span className="text-sm font-normal">NTD$ {orderTotalAmount}</span>
                    </div>
                </div>
            </div>
        </div>
    )

}