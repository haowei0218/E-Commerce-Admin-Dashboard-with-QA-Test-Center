'use client'
import { FaLongArrowAltLeft } from "react-icons/fa";
import Link from "next/link";
import Breadcrumbs from "@/app/(admin)/users/components/breadcrumbs";
import { useState } from "react";
import { Input } from "@base-ui/react";
import { FaRegImages } from "react-icons/fa6";
import Image from "next/image";
import { IoMdCloseCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import { IoAlertCircleOutline } from "react-icons/io5";
import { SelectMenu } from "@/components/SelectMenu"
import { productStatusList } from "@/lib/data";
import { productStatus } from "@/type/products/products.base";




export default function CreateProduct() {
    const [productName, setProductName] = useState<string>('')
    const [productDescription, setProductDescription] = useState<string>('')
    const [productImage, setProductImage] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string>('')
    const [status, setStatus] = useState<productStatus>('draft')
    const HandleProductName = (words: string) => {
        setProductName(words)
    }
    const HandleProductDescription = (words: string) => {
        setProductDescription(words)
    }

    const handleProductImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setProductImage(selectedFile)
        const url = URL.createObjectURL(selectedFile);
        setPreviewImage(url)
    }
    return (
        <div className='bg-gray-50 h-full p-5 overflow-auto'>
            <div className="flex justify-between items-center h-20">
                <div className="grid gap-2">
                    <h1 className="text-2xl font-bold ">Create Product</h1>
                    <p className="text-sm font-medium text-gray-600">Add new product to store. Fill in the product information and set the inventory、pricing and status</p>
                </div>
                <button className="flex w-50 h-15 justify-center items-center gap-2 hover:bg-gray-300 hover:cursor-pointer border-2 border-gray-500 rounded-lg bg-white" >
                    <FaLongArrowAltLeft className="font-normal text-black" />
                    <Link href='/products' className="text-lg font-normal text-black">Back to products</Link>
                </button>
            </div>


            <form className="flex gap-5 w-full m-auto">
                <div className="w-[65%] p-8 bg-white rounded-lg grid gap-12 shadow shadow-gray-500">

                    <div className="grid gap-4 border-b-gray-300 border-b-2">
                        <div>
                            <h3 className="text-xl font-bold">Basic Information</h3>
                            <p className="text-sm text-gray-600 font-normal">Provider the essential details about your product</p>
                        </div>

                        <div>
                            <p className="text-[16px] font-medium">Product Name</p>
                            <input type="text" maxLength={100} onChange={(e) => HandleProductName(e.target.value)} className="w-full h-10 border border-gray-500 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500" placeholder="e.g 電競滑鼠"></input>
                            <div className="flex justify-end">
                                <p className="text-sm text-gray-500">{productName.length} / 100</p>
                            </div>
                        </div>

                        <div className="mb-4 ">
                            <p className="text-[16px] font-medium">Product Description</p>
                            <textarea maxLength={500} onChange={(e) => HandleProductDescription(e.target.value)} className="w-full h-30 border border-gray-500 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500 resize-none overflow-hidden" ></textarea>
                            <div className="flex justify-end">
                                <p className="text-sm text-gray-500">{productName.length} / 500</p>
                            </div>
                        </div>

                    </div>
                    <div className="grid gap-4 border-b-gray-300 border-b-2">
                        <div>
                            <h3 className="text-xl font-bold">Product Media</h3>
                            <p className="text-sm text-gray-600 font-normal">Upload a product image</p>
                        </div>


                        <div className="flex w-full gap-2 items-center">
                            <div className="w-[50%] mb-9">
                                <p className="text-[16px] font-bold">Product image <span className="text-red-500">*</span></p>
                                <div className="flex flex-col justify-center items-center m-auto">

                                    <label
                                        htmlFor="product-image"
                                        className="flex h-52 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-500"
                                    >
                                        <FaRegImages className="h-8 w-8 text-gray-400" />

                                        <p className="font-semibold">
                                            Click to upload an image
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            PNG, JPG up to 5MB

                                        </p>

                                        <span className="rounded-lg border px-5 py-2 hover:cursor-pointer hover:bg-gray-300 hover:text-white font-bold ">
                                            Upload Image
                                            <input
                                                type="file"
                                                id="product-image"
                                                accept="image/png,image/jpeg"
                                                className="hidden"
                                                onChange={(e) => handleProductImage(e)}
                                            />
                                        </span>
                                    </label>

                                </div>
                            </div>

                            <div className="w-[50%] mb-9">
                                <div className="flex w-full justify-between items-center">
                                    <p className="text-[16px] font-bold">Preview Image</p>
                                    <IoMdCloseCircle className="text-red-500 text-2xl" onClick={() => setPreviewImage("")} />
                                </div>
                                <div

                                    className="flex h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-500 bg-gray-100 "

                                >

                                    <div className={`${previewImage && "hidden"} grid gap-2 justify-items-center p-2`}>
                                        <FaRegImages className="h-8 w-8 text-gray-400" />
                                        <p>Image preview will appear here</p>
                                    </div>

                                    {previewImage && <img src={previewImage} alt="preview" className="w-full h-full" />}

                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="grid gap-4 border-b-gray-300 border-b-2">
                        <div>
                            <h3 className="text-xl font-bold">Product Details</h3>
                            <p className="text-sm text-gray-600 font-normal">Set the product specifications and inventory information</p>
                        </div>


                        <div className="flex items-start gap-2 w-full">
                            <div className="w-[50%]">
                                <p className="text-[16px] font-medium">SKU</p>
                                <input type="text" maxLength={100} onChange={(e) => HandleProductName(e.target.value)} className="w-full h-10 border border-gray-500 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500" placeholder="e.g Mouse-001"></input>
                                <p className="text-sm text-gray-500">Unique identifier for your product</p>
                            </div>
                            <div className="w-[50%]">
                                <p className="text-[16px] font-medium">Price</p>

                                <div className="flex items-center">
                                    <div className="w-20 h-10 bg-gray-100 items-center justify-center flex text-[16px] font-bold border border-gray-500 rounded-l-lg">
                                        <p>NTD$</p>
                                    </div>
                                    <input type="number" maxLength={100} onChange={(e) => HandleProductName(e.target.value)} className="w-full h-10 border-t border-r border-b border-t-gray-500 border-r-gray-500 border-b-gray-500 rounded-r-lg  p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500" placeholder="0"></input>
                                </div>

                            </div>
                        </div>



                        <div className="flex items-start gap-2 w-full mb-5">
                            <div className="w-[50%]">
                                <p className="text-[16px] font-medium">Stock Quantity</p>
                                <input type="text" maxLength={100} onChange={(e) => HandleProductName(e.target.value)} className="w-full h-10 border border-gray-500 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500" placeholder="0"></input>
                                <p className="text-sm text-gray-500">Available stock quantity</p>
                            </div>
                            <div className="w-[50%]">
                                <p className="text-[16px] font-medium">Color</p>
                                <input type="text" maxLength={100} onChange={(e) => HandleProductName(e.target.value)} className="w-full h-10 border border-gray-500 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500" placeholder="e.g black、yellow"></input>
                                <p className="text-sm text-gray-500">Product color</p>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-[35%] bg-white rounded-lg shadow shadow-gray-500 p-8">
                    <div className="grid gap-4">
                        <div>
                            <h3 className="text-xl font-bold">Product Status</h3>
                            <p className="text-sm text-gray-600 font-normal">Provider the essential details about your product</p>
                        </div>

                        <div className="grid gap-2">
                            <p className="text-[16px] font-medium">Status</p>
                            <SelectMenu props={productStatusList} value={status} onSelectMenuValueChange={setStatus} label=""/>
                            <p className="text-sm text-gray-500 font-bold">draft product are not visable in customer</p>
                        </div>
                        <div className="flex items-center p-3 bg-blue-200 text-sm text-blue-400 font-bold rounded-xl">
                            <IoAlertCircleOutline />
                            <p>You can change product status later</p>
                        </div>



                    </div>
                </div>
            </form>







        </div>
    )
}