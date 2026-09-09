'use client'
import { useParams } from "next/navigation";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";
import { FaLongArrowAltDown, FaLongArrowAltLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import { order } from "@/type/orders/base.type";
import { getOrderById } from "@/lib/orders.api";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import productLoading from '@/public/images/productLoading.jpg'

export default function OrderDetails() {
    const params = useParams<{ id: string }>()
    const orderId = params.id ?? ""
    const [orderDetails, setOrderDetails] = useState<order | null>(null)
    const [createOrderDate, setCreateOrderDate] = useState("")

   

    async function fetchOrderDetails() {
        try {
            const response = await getOrderById(orderId)
            setOrderDetails(response.getOrderById.result)
            setCreateOrderDate(response.getOrderById.result?.created_at)
            return response.getOrderById.result
        } catch (error) {
            console.log('fetch order details fail : ', error)
        }
    }
    useEffect(() => {
        fetchOrderDetails().then((res) => res ? setOrderDetails(res) : null)
    }, [])

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

            <div className="flex gap-4 mt-10">
                <div className="w-200 min-h-25 p-2 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center">
                        <div>
                            <Image src={orderDetails?.order_items[0].product_image_url ?? productLoading} alt="product image" width={20} height={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}