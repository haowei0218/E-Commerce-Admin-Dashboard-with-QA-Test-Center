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
import Image from "next/image";
import productLoading from '@/public/images/productLoading.jpg'
import { OrderItemCard } from "../../components/order-item-card";
import { randomUUID } from "crypto";
import { randomKey } from "@/lib/utils";

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
    const subTotal = Number(orderItems[0]?.purchase_quantity) * orderItems[0]?.price
    const orderItemsHeight = String((25 * orderItems.length) + 20)


    return (
        <div className='bg-gray-50 w-full h-full p-10 overflow-y-auto'>
            <div className="flex flex-col justify-start items-start gap-4">
                <button className="flex items-center gap-2 hover:text-blue-900 hover:cursor-pointer">
                    <FaLongArrowAltLeft className="font-black text-blue-500" />
                    <Link href='/orders' className="text-lg font-black text-blue-500">back</Link>
                </button>

                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold'>
                        Order Details
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
            </div>

            <div className={`flex flex-col gap-4 mt-10 bg-white w-210 border border-gray-200 rounded-lg p-4`}>
                <h1 className="font-extrabold text-lg">Items({orderDetails?.order_items.length ?? 0})</h1>
                <div className={`py-5 gap-5 ${orderItemsHeight} flex flex-col`}>
                    {orderItemsDisplay ? orderItems?.map((orderItem: orderItems) => <OrderItemCard key={randomKey()} orderDetails={orderItem} />) : orderItems?.slice(0, 3).map((orderItem: orderItems) => <OrderItemCard key={String(Math.floor(Math.random() * 999999))} orderDetails={orderItem} />)}
                    <div className={`w-full ${orderItems.length > 3 ? "" : 'hidden'}`} onClick={() => setorderItemsDisplay(!orderItemsDisplay)}>
                        <button className="w-20 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-white hover:bg-gray-500 hover:text-white m-auto" >show all</button>
                    </div>
                </div>
            </div>
        </div>
    )

}