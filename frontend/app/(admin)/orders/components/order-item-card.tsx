'use client'
import Image from "next/image"
import { orderItems } from "@/type/orders/base.type"
import productLoading from '@/public/images/productLoading.jpg'
import { uuid } from "zod"
import { randomUUID } from "crypto"
import { randomKey } from "@/lib/utils";
export function OrderItemCard({
    orderDetails
}: {
    orderDetails: orderItems
}) {

    const subTotal = Number(orderDetails?.purchase_quantity) * orderDetails?.price
    return (
        <div key={randomKey()} className="flex items-center gap-4 h-40 border-b-3 border-b-gray-200">
            <div className="w-25 h-25 flex items-center rounded-lg shadow shadow-gray-400">
                <Image src={orderDetails?.product_image_url ?? productLoading} alt="product image" width={70} height={70} className="m-auto" />
            </div>

            <div className="flex justify-between gap-10">
                <div className="flex flex-col gap-4 justify-center w-70 h-25">
                    <h3 className="font-bold text-lg">{orderDetails?.product_name ?? "loading..."}</h3>
                    <span className="text-gray-500 text-lg">型號 : {orderDetails?.sku ?? "loading..."}</span>
                </div>

                <div className="flex flex-col gap-4 justify-center w-25 h-25">
                    <h3 className="font-bold text-sm">Unit Price</h3>
                    <span className="text-gray-500 text-sm">NTD${orderDetails?.price ?? "loading..."}</span>
                </div>

                <div className="flex flex-col gap-4 justify-center w-25 h-25">
                    <h3 className="font-bold text-sm">QTY</h3>
                    <span className="text-gray-500 text-sm">{orderDetails?.purchase_quantity ?? "loading..."}</span>
                </div>

                <div className="flex flex-col gap-4 justify-center pl-4 w-30 h-25 border-l-3 border-l-gray-300">
                    <h3 className="font-bold text-sm">SubTotal</h3>
                    <span className="text-gray-500 text-sm">NTD$ {subTotal ?? "loading..."}</span>
                </div>
            </div>
        </div>
    )
}