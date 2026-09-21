'use client'
import { useParams } from "next/navigation";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";
import { FaLongArrowAltDown, FaLongArrowAltLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import { order, orderItems, orderStatus, paymentStatus, shippingStatus } from "@/type/orders/base.type";
import { getOrderById, updateOrderStatus } from "@/lib/orders.api";
import { formatDate } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { OrderItemCard } from "../../components/order-item-card";
import { randomKey } from "@/lib/utils";
import { LuMapPin } from "react-icons/lu";
import { IoWalletOutline } from "react-icons/io5";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import Breadcrumbs from "@/app/(admin)/users/components/breadcrumbs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@base-ui/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { CiCircleQuestion } from "react-icons/ci";
import { toast } from "sonner";
import { ChangeStatusDialog } from "../../components/change-status-dialog";



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
    const [open, setOpen] = useState<boolean>(false)
    const [order_status, setOrderStatus] = useState<orderStatus>('pending')

    const [paymentStatusOpen, setPaymentStatusOpen] = useState<boolean>(false)
    const [payment_status, setPaymentStatus] = useState<paymentStatus>('unpaid')

    const [shippingStatusOpen, setShippingStatusOpen] = useState<boolean>(false)
    const [shipping_status, setShippingStatus] = useState<shippingStatus>('pending')

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
    const orderTotalAmount = (orderItems.map((item) => Number(item.purchase_quantity) * item.price).reduce((a, b) => a + b, 0))
    const orderStatus = orderDetails?.order_status ?? 'pending'


    // order time line = create + process(order status) + shipped + delivered(shipping status)
    const orderTimeLine = {
        create_at: orderDetails?.created_at,
        process_at: orderDetails?.created_at,
        shipped_at: "",
        delivered_at: ""
    }
    const orderSummary = {
        order_status: orderDetails?.order_status ?? 'pending'
    }

    const updateOrderStatusMutation = useMutation({
        mutationFn: () => updateOrderStatus({ id: orderId, order_status: order_status, cancel_reason: "admin cancel this order" }),
        onSuccess: () => {
            toast.success('變更訂單狀態成功')
            setOpen(false)
        },
    })

    console.log('update order status payload : ', { id: orderId, order_status: order_status, cancel_reason: "admin cancel this order" })

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


            <div className="flex items-start gap-4">

                <section>
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
                        <h1 className="font-extrabold text-lg">Order TimeLine</h1>
                        <div className="flex gap-4 justify-start items-start">

                            <div className="flex flex-col">

                                <div className="flex items-center gap-4 w-50">
                                    <FaCheckCircle className="text-green-600" size={30} />
                                    <div className="flex flex-col justify-start">
                                        <h2 className="font-bold text-[16px]">Order create</h2>
                                        <span className="text-sm">{formatDate(orderDetails?.created_at ?? "")}</span>
                                    </div>
                                </div>

                                <div className="grid">
                                    <span className="font-bold text-black text-lg pl-3">|</span>
                                </div>

                                <div className="flex items-center gap-4 w-50">
                                    <FaCheckCircle className="text-green-600" size={30} />
                                    <div className="flex flex-col justify-start">
                                        <h2 className="font-bold text-[16px]">Processing</h2>

                                        {/* 更新成準備中的時候 */}
                                        <span className="text-sm">{formatDate(orderDetails?.created_at ?? "")}</span>
                                    </div>
                                </div>

                                <div className="grid">
                                    <span className="font-bold text-black text-lg pl-3">|</span>
                                </div>


                                <div className="flex items-center gap-4 w-50">
                                    <FaCheckCircle className="text-green-600" size={30} />
                                    <div className="flex flex-col justify-start">
                                        <h2 className="font-bold text-[16px]">Shipping</h2>

                                        {/* 出貨中 */}
                                        <span className="text-sm">{formatDate(orderDetails?.created_at ?? "")}</span>
                                    </div>
                                </div>

                                <div className="grid">
                                    <span className="font-bold text-black text-lg pl-3">|</span>
                                </div>

                                <div className="flex items-center gap-4 w-50">
                                    <FaCheckCircle className="text-green-600" size={30} />
                                    <div className="flex flex-col justify-start">
                                        <h2 className="font-bold text-[16px]">Delivered</h2>

                                        {/* 送達 */}
                                        <span className="text-sm">{formatDate(orderDetails?.created_at ?? "")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    {/* quick action */}
                    <div className={`flex flex-col gap-4 mt-10 bg-white w-full rounded-lg p-5 border border-gray-200`}>
                        <h1 className="font-extrabold text-lg">Quick Action</h1>
                        <div className="py-5 gap-3 flex flex-col m-auto">
                            <ChangeStatusDialog openControl={open} openController={setOpen} status={order_status} statusController={setOrderStatus} statusList={['pending', 'processing', 'completed', 'cancelled']} type="order" changeStatusMutation={updateOrderStatusMutation} color="text-blue-500 border-blue-500 border"/>
                        </div>

                        <div className="py-5 gap-3 flex flex-col m-auto">
                            <Dialog open={open} onOpenChange={setOpen}>
                                <Select onValueChange={(value) => {
                                    setOpen(true)
                                    setOrderStatus(value as orderStatus)
                                }}>
                                    <SelectTrigger className="w-100 !h-10 flex justify-center items-center bg-white text-blue-500 hover:bg-blue-500 hover:text-white font-semibold rounded-xl border border-blue-500">
                                        <FaEdit />
                                        <span>Edit Order Status</span>
                                    </SelectTrigger>

                                    <SelectContent className="bg-white">
                                        {["pending", "processing", "completed", "cancelled"].map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                                className="cursor-pointer capitalize hover:bg-gray-100"
                                            >
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>



                                <DialogContent className="w-120 max-w-[600px] sm:max-w-[600px] h-80 bg-white ">
                                    <DialogDescription className="flex flex-col items-center mt-5 gap-5">
                                        <CiCircleQuestion size={80} className="text-gray-400" />
                                        <span className="text-gray-800 text-2xl">Confirm status change</span>
                                        <span className="font-medium text-gray-900 text-lg">
                                            change the order status to <strong>{order_status}</strong>?
                                        </span>

                                    </DialogDescription>
                                    <div className="flex justify-center gap-4 items-center">
                                        <Button
                                            onClick={() => setOpen(false)}
                                            className='w-40 h-10 bg-red-500  hover:bg-red-600 text-white font-bold rounded-xl'
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            onClick={async () => {
                                                updateOrderStatusMutation.mutate()

                                            }}
                                            className='w-40 h-10 bg-blue-500  hover:bg-blue-600 text-white font-bold rounded-xl'
                                        >
                                            {updateOrderStatusMutation.isPending ? "updating..." : "Confirm"}
                                        </Button>
                                    </div>


                                </DialogContent>
                            </Dialog>
                        </div>

                    </div>
                    {/* order summary */}
                    <div className={`flex flex-col gap-4 mt-5 bg-white w-120 border border-gray-200 rounded-lg p-5`}>
                        <div className="flex justify-between items-center">
                            <h1 className="font-extrabold text-lg">Order Summary</h1>
                            <div className={`${orderStatusStyle[orderStatus]} rounded-2xl w-25 h-10 flex justify-center items-center text-sm font-bold`}>
                                <span>{orderDetails?.order_status}</span>
                            </div>
                        </div>

                        <div className="py-5 gap-3 flex flex-col border-b-2 border-b-gray-400">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-[15px] text-gray-500">Order Number</span>
                                <span className="font-normal text-sm">{orderDetails?.order_number}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-[15px] text-gray-500">Order Date</span>
                                <span className="font-normal text-sm">{formatDate(orderDetails?.created_at ?? '')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-[15px] text-gray-500">Order Status</span>
                                <div className={`${orderStatusStyle[orderStatus]} rounded-2xl w-25 h-6 flex justify-center items-center text-sm font-bold`}>
                                    <span>{orderDetails?.order_status}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-[15px] text-gray-500">Payment Status</span>
                                <div className={`${paymentStatusStyle[paymentInformation.payment_status]} rounded-2xl w-25 h-6 flex justify-center items-center text-sm font-bold`}>
                                    <span>{paymentInformation.payment_status}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-[15px] text-gray-500">Shipping Status</span>
                                <div className={`${shippingStatusStyle[shippingInformation.shipping_status]} rounded-2xl w-25 h-6 flex justify-center items-center text-sm font-bold`}>
                                    <span>{shippingInformation.shipping_status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="py-5 gap-3 flex flex-col">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-[15px] text-gray-500">Items SubTotal</span>
                                <span className="font-normal text-sm">NTD$ {orderTotalAmount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-[15px] text-gray-500">shipping Fee</span>
                                <span className="font-normal text-sm">NTD$ 60</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Total Amount</span>
                                <span className="font-bold text-lg">NTD$ {orderDetails?.total_amount}</span>
                            </div>
                        </div>
                    </div>



                </section>

            </div>


        </div>
    )

}