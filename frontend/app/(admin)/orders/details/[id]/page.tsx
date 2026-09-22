'use client'
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useState } from "react";
import { orderItems, orderStatus, paymentStatus, shippingStatus } from "@/type/orders/base.type";
import { getOrderById, updateOrderNote, updateOrderStatus, updatePaymentStatus, updateShippingStatus } from "@/lib/orders.api";
import { formatDate } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderItemCard } from "../../components/order-item-card";
import { randomKey } from "@/lib/utils";
import { LuMapPin } from "react-icons/lu";
import { IoWalletOutline } from "react-icons/io5";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import Breadcrumbs from "@/app/(admin)/users/components/breadcrumbs";
import { toast } from "sonner";
import { ChangeStatusDialog } from "../../components/change-status-dialog";
import { CiEdit } from "react-icons/ci";
import { LuNotebook } from "react-icons/lu";
import { getOrderEvent } from "@/lib/order-event.api";



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

    const [editNoteOpen, setEditNoteOpen] = useState<boolean>(false)
    const [note, setNote] = useState<string>('')

    const getOrderByIdQuery = useQuery({
        queryKey: ["order-by-id", orderId],
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
    const queryClient = useQueryClient()


    const orderEventQuery = useQuery({
        queryKey: ['order-events'],
        queryFn: () => getOrderEvent(orderId),
        enabled: Boolean(orderId)
    })

    const orderEvents = orderEventQuery.data?.getOrderEvent.result
    console.log('order events : ', orderEvents)

    const updateOrderStatusMutation = useMutation({
        mutationFn: () => updateOrderStatus({ id: orderId, order_status: order_status, cancel_reason: "admin cancel this order" }),
        onSuccess: () => {
            toast.success('變更訂單狀態成功')
            setOpen(false)
            getOrderByIdQuery.refetch()
            queryClient.invalidateQueries({
                queryKey: ["order-by-id", orderId],
            })
        },

    })

    const updatePaymentStatusMutation = useMutation({
        mutationFn: () => updatePaymentStatus({ id: orderId, payment_status: payment_status }),
        onSuccess: () => {
            toast.success('變更訂單付款狀態成功')
            setPaymentStatusOpen(false)
            queryClient.invalidateQueries({
                queryKey: ["order-by-id", orderId],
            })
        }
    })

    const updateShippingStatusMutation = useMutation({
        mutationFn: () => updateShippingStatus({ id: orderId, shipping_status: shipping_status }),
        onSuccess: () => {
            toast.success('變更訂單物流狀態成功')
            setShippingStatusOpen(false)
            queryClient.invalidateQueries({
                queryKey: ["order-by-id", orderId],
            })
        }
    })

    const updateOrderNoteMutation = useMutation({
        mutationFn: () => updateOrderNote({ id: orderId, note: note }),
        onSuccess: () => {
            toast.success('變更訂單備註成功')
            setEditNoteOpen(false)
            queryClient.invalidateQueries({
                queryKey: ["order-by-id", orderId],
            })
        },
        onError: () => {
            toast.error("變更訂單備註失敗")
        },
    })




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


                </section>

                <section>
                    {/* quick action */}
                    <div className={`flex flex-col gap-4 mt-10 bg-white w-full rounded-lg p-5 border border-gray-200`}>
                        <h1 className="font-extrabold text-lg">Quick Action</h1>
                        <div className="py-5 gap-3 flex flex-col m-auto">
                            <ChangeStatusDialog openControl={open} openController={setOpen} status={order_status} statusController={setOrderStatus} statusList={['pending', 'processing', 'completed', 'cancelled']} type="order" changeStatusMutation={updateOrderStatusMutation} color="text-blue-500 border-blue-500 border hover:bg-blue-500" />
                            <ChangeStatusDialog openControl={paymentStatusOpen} openController={setPaymentStatusOpen} status={payment_status} statusController={setPaymentStatus} statusList={['unpaid', 'paid', 'failed', 'refunded']} type="payment" changeStatusMutation={updatePaymentStatusMutation} color="text-green-500 border-green-500 border hover:bg-green-500" />
                            <ChangeStatusDialog openControl={shippingStatusOpen} openController={setShippingStatusOpen} status={shipping_status} statusController={setShippingStatus} statusList={['pending', 'preparing', 'shipped', 'delivered', 'returned']} type="shipping" changeStatusMutation={updateShippingStatusMutation} color="text-yellow-500 border-yellow-500 border hover:bg-yellow-500" />
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

                    <div className="flex flex-col gap-4 mt-5 bg-white w-120 border border-gray-200 rounded-lg p-5 ">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <LuNotebook size={30} />
                                <h1 className="font-extrabold text-lg">Edit Note</h1>
                            </div>
                            {editNoteOpen ? <div className="flex items-center gap-2">
                                <button className="flex w-20 h-6 justify-center items-center border-2 border-gray-500 text-gray-600 hover:bg-gray-500 hover:text-white rounded-lg" onClick={() => setEditNoteOpen(!editNoteOpen)}>cancel</button>
                                <button className="flex w-20 h-6 justify-center items-center border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg" onClick={() => updateOrderNoteMutation.mutate()}> {updateOrderNoteMutation.isPending ? "saving..." : "save"}</button>
                            </div>
                                : <CiEdit size={30} className="hover:cursor-pointer hover:text-gray-500" onClick={() => setEditNoteOpen(!editNoteOpen)} />}
                        </div>

                        {editNoteOpen ?
                            <div className="grid gap-2">
                                <textarea onChange={(e) => setNote(e.target.value)} className="w-110 h-40 p-2 border-2 border-gray-300 rounded-xl" placeholder="edit note..." maxLength={250} />
                                <div className="flex justify-end">
                                    <p>{note.length} / 250</p>
                                </div>
                            </div> :
                            <span className="m-auto font-normal text-sm">{orderDetails?.note}</span>}
                    </div>
                </section>

                <section>
                    {/* Order TimeLine*/}
                    <div className="flex flex-col gap-4 mt-10 bg-white w-100 border border-gray-200 rounded-lg p-4">
                        <h1 className="font-extrabold text-lg">Order TimeLine</h1>
                        <div className="flex gap-4 justify-start items-start">

                            <div className="flex flex-col">
                                {orderEvents?.map((events, index) => {
                                    return (
                                        <div className="flex items-center gap-4 w-50">
                                            <FaCheckCircle className="text-green-600" size={30} />
                                            <div className="flex flex-col justify-start">
                                                <h2 className="font-bold text-[16px]">{events.event_type.toLowerCase()}</h2>
                                                <span className="text-sm">{formatDate(events?.create_at ?? "")}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )

}