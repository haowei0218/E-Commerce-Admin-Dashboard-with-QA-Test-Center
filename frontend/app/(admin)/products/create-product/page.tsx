'use client'
import { FaLongArrowAltLeft } from "react-icons/fa";
import Link from "next/link";
import Breadcrumbs from "@/app/(admin)/users/components/breadcrumbs";
import { useState } from "react";
export default function CreateProduct() {
    const [productName, setProductName] = useState<string>('')
    const [productDescription, setProductDescription] = useState<string>('')
    const HandleProductName = (words: string) => {
        setProductName(words)
    }
    const HandleProductDescription = (words:string) =>{
        setProductDescription(words)
    }
    return (
        <div className='bg-gray-50 h-full p-5'>
            <div className="flex justify-between items-center h-20">
                <div className="grid gap-2">
                    <h1 className="text-2xl font-bold ">Create Product</h1>
                    <p className="text-sm font-medium text-gray-600">Add new product to store. Fill in the product information and set the inventory、pricing and status</p>
                </div>
                <button className="flex w-50 h-15 justify-center items-center gap-2 hover:bg-gray-300 hover:cursor-pointer border-2 border-gray-300 rounded-lg bg-white" >
                    <FaLongArrowAltLeft className="font-normal text-black" />
                    <Link href='/products' className="text-lg font-normal text-black">Back to products</Link>
                </button>
            </div>


            <div className="flex gap-2">
                <div className="w-[60%] p-8 bg-white rounded-lg">
                    <div className="grid gap-4 border-b-gray-300 border-b-2">
                        <div>
                            <h3 className="text-xl font-bold">Basic Information</h3>
                            <p className="text-sm text-gray-600 font-normal">Provider the essential details about your product</p>
                        </div>

                        <div>
                            <p className="text-[16px] font-medium">Product Name</p>
                            <input type="text" maxLength={100} onChange={(e) => HandleProductName(e.target.value)} className="w-full h-10 border border-gray-200 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500" placeholder="e.g 電競滑鼠"></input>
                            <div className="flex justify-end">
                                <p className="text-sm text-gray-500">{productName.length} / 100</p>
                            </div>
                        </div>

                        <div className="mb-4 ">
                            <p className="text-[16px] font-medium">Product Description</p>
                            <textarea maxLength={500} onChange={(e) => HandleProductDescription(e.target.value)} className="w-full h-30 border border-gray-200 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500 resize-none overflow-hidden" ></textarea>
                            <div className="flex justify-end">
                                <p className="text-sm text-gray-500">{productName.length} / 500</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}