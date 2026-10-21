"use client";
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
import { SelectMenu } from "@/components/SelectMenu";
import { productStatusList } from "@/lib/data";
import { product, productStatus } from "@/type/products/products.base";
import { FaRegCircle } from "react-icons/fa";
import { checkStock } from "../components/products-table";
import { FaCircle } from "react-icons/fa";
import { promise, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { statusStyle } from "../components/products-table";
import { createProduct, getProductImageUrl, uploadProductImage } from "@/lib/products.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
    const [productImage, setProductImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [status, setStatus] = useState<productStatus>("draft");
    const router = useRouter()

    const handleProductImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setProductImage(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        setPreviewImage(url);
    };

    const productPayload = z.object({
        product_name: z
            .string()
            .trim()
            .min(1, "Product name is required")
            .max(100, "Product name must be under 100 characters"),

        product_description: z
            .string()
            .trim()
            .min(1, "Product description is required")
            .max(500, "Description must be under 500 characters"),

        product_image_url: z.url("Invalid image URL"),

        product_sku: z.string().trim().min(1, "SKU is required"),

        product_price: z
            .string()
            .trim()
            .min(1, "Price is required")
            .refine(
                (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
                "Price must be a valid non-negative number",
            ),

        color: z.string().trim().min(1, "Color is required"),

        stock_quantity: z
            .number()
            .int("Stock must be an integer")
            .min(0, "Stock cannot be negative"),

        status: z.enum(["draft", "published", "unpublished", "archived"]),
    });

    type productInformation = z.infer<typeof productPayload>;
    const productForm = useForm<productInformation>({
        resolver: zodResolver(productPayload),
        defaultValues: {
            product_name: "",
            product_description: "",
            product_image_url: "",
            product_sku: "",
            product_price: "0",
            color: "-",
            stock_quantity: 0,
            status: "draft",
        },
    });

    const productName = productForm.watch("product_name");
    const productDescription = productForm.watch("product_description");
    const productSKU = productForm.watch("product_sku");
    const productPrice = productForm.watch("product_price");
    const productColor = productForm.watch("color");
    const stockQuantity = productForm.watch("stock_quantity");
    const productStatus = productForm.watch("status");

    const onSubmit = async (data: productInformation) => {
        const imagePath = await uploadProductImage(productImage)
        const imageUrl = imagePath ? await getProductImageUrl(imagePath) : ""
        const payload = {
            ...data,
            stock_quantity: Number(data.stock_quantity),
            product_image_url: imageUrl,
            status: status,
        };
        try {
            const result = await createProduct(payload)
            if (result) {
                toast.success('創建商品成功')
                productForm.reset()
                router.push('/')
            }

        } catch (error) {
            toast.error('創建商品失敗')
            throw error
        }

        console.log("submit data : ", payload);
    };

    return (
        <div className="bg-gray-50 h-full p-5 overflow-auto">
            <div className="flex justify-between items-center h-20">
                <div className="grid gap-2">
                    <h1 className="text-2xl font-bold ">Create Product</h1>
                    <p className="text-sm font-medium text-gray-600">
                        Add new product to store. Fill in the product information and set
                        the inventory、pricing and status
                    </p>
                </div>
                <button className="flex w-50 h-15 justify-center items-center gap-2 hover:bg-gray-300 hover:cursor-pointer border-2 border-gray-500 rounded-lg bg-white">
                    <FaLongArrowAltLeft className="font-normal text-black" />
                    <Link href="/products" className="text-lg font-normal text-black">
                        Back to products
                    </Link>
                </button>
            </div>

            <form
                onSubmit={productForm.handleSubmit(onSubmit)}
                className="flex gap-5 w-full m-auto"
            >
                <div className="w-[65%] p-8 bg-white rounded-lg grid gap-12 shadow shadow-gray-500">
                    <div className="grid gap-4 border-b-gray-300 border-b-2">
                        <div>
                            <h3 className="text-xl font-bold">Basic Information</h3>
                            <p className="text-sm text-gray-600 font-normal">
                                Provider the essential details about your product
                            </p>
                        </div>

                        <div>
                            <p className="text-[16px] font-medium">Product Name</p>
                            <input
                                {...productForm.register("product_name")}
                                type="text"
                                maxLength={100}
                                className="w-full h-10 border border-gray-500 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500"
                                placeholder="e.g 電競滑鼠"
                            ></input>
                            <div className="flex justify-end">
                                <p className="text-sm text-gray-500">
                                    {productName.length} / 100
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 ">
                            <p className="text-[16px] font-medium">Product Description</p>
                            <textarea
                                {...productForm.register("product_description")}
                                maxLength={500}
                                className="w-full h-30 border border-gray-500 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500 resize-none overflow-hidden"
                            ></textarea>
                            <div className="flex justify-end">
                                <p className="text-sm text-gray-500">
                                    {productDescription.length} / 500
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 border-b-gray-300 border-b-2">
                        <div>
                            <h3 className="text-xl font-bold">Product Media</h3>
                            <p className="text-sm text-gray-600 font-normal">
                                Upload a product image
                            </p>
                        </div>

                        <div className="flex w-full gap-2 items-center">
                            <div className="w-[50%] mb-9">
                                <p className="text-[16px] font-bold">
                                    Product image <span className="text-red-500">*</span>
                                </p>
                                <div className="flex flex-col justify-center items-center m-auto">
                                    <label
                                        htmlFor="product-image"
                                        className="flex h-52 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-500"
                                    >
                                        <FaRegImages className="h-8 w-8 text-gray-400" />

                                        <p className="font-semibold">Click to upload an image</p>

                                        <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>

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
                                    <IoMdCloseCircle
                                        className="text-red-500 text-2xl"
                                        onClick={() => setPreviewImage("")}
                                    />
                                </div>
                                <div className="flex h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-500 bg-gray-100 ">
                                    <div
                                        className={`${previewImage && "hidden"} grid gap-2 justify-items-center p-2`}
                                    >
                                        <FaRegImages className="h-8 w-8 text-gray-400" />
                                        <p>Image preview will appear here</p>
                                    </div>

                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="preview"
                                            className="w-full h-full"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 border-b-gray-300 border-b-2">
                        <div>
                            <h3 className="text-xl font-bold">Product Details</h3>
                            <p className="text-sm text-gray-600 font-normal">
                                Set the product specifications and inventory information
                            </p>
                        </div>

                        <div className="flex items-start gap-2 w-full">
                            <div className="w-[50%]">
                                <p className="text-[16px] font-medium">SKU</p>
                                <input
                                    type="text"
                                    maxLength={100}
                                    {...productForm.register("product_sku")}
                                    className="w-full h-10 border border-gray-500 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500"
                                    placeholder="e.g Mouse-001"
                                ></input>
                                <p className="text-sm text-gray-500">
                                    Unique identifier for your product
                                </p>
                            </div>
                            <div className="w-[50%]">
                                <p className="text-[16px] font-medium">Price</p>

                                <div className="flex items-center">
                                    <div className="w-20 h-10 bg-gray-100 items-center justify-center flex text-[16px] font-bold border border-gray-500 rounded-l-lg">
                                        <p>NTD$</p>
                                    </div>
                                    <input
                                        type="number"
                                        {...productForm.register("product_price")}
                                        className="w-full h-10 border-t border-r border-b border-t-gray-500 border-r-gray-500 border-b-gray-500 rounded-r-lg  p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500"
                                        placeholder="0"
                                    ></input>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 w-full mb-5">
                            <div className="w-[50%]">
                                <p className="text-[16px] font-medium">Stock Quantity</p>
                                <input
                                    type="text"
                                    maxLength={100}
                                    {...productForm.register("stock_quantity")}
                                    className="w-full h-10 border border-gray-500 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500"
                                    placeholder="0"
                                ></input>
                                <p className="text-sm text-gray-500">
                                    Available stock quantity
                                </p>
                            </div>
                            <div className="w-[50%]">
                                <p className="text-[16px] font-medium">Color</p>
                                <input
                                    type="text"
                                    maxLength={100}
                                    {...productForm.register("color")}
                                    className="w-full h-10 border border-gray-500 rounded-lg p-2 outline-none focus:outline-none focus:ring-0 focus:border-gray-500"
                                    placeholder="e.g black、yellow"
                                ></input>
                                <p className="text-sm text-gray-500">Product color</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-[35%] h-[70%] grid gap-4">
                    <div className="w-full h-70 bg-white rounded-lg shadow shadow-gray-500 p-8">
                        <div className="grid gap-4">
                            <div>
                                <h3 className="text-xl font-bold">Product Status</h3>
                                <p className="text-sm text-gray-600 font-normal">
                                    Provider the essential details about your product
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <p className="text-[16px] font-medium">Status</p>
                                <SelectMenu
                                    props={productStatusList}
                                    value={status}
                                    onSelectMenuValueChange={setStatus}
                                    label=""
                                    selectMenuStyle={{ width: "100%", borderColor: "" }}
                                />
                                <p className="text-sm text-gray-500 font-bold">
                                    draft product are not visable in customer
                                </p>
                            </div>
                            <div className="flex items-center p-3 bg-blue-200 text-sm text-blue-400 font-bold rounded-xl">
                                <IoAlertCircleOutline />
                                <p>You can change product status later</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-140 bg-white rounded-lg shadow shadow-gray-500 p-8">
                        <div className="grid gap-4">
                            <div>
                                <h3 className="text-xl font-bold">Product Preview</h3>
                                <p className="text-sm text-gray-600 font-normal">
                                    This is how your product will appear in store
                                </p>
                            </div>

                            <div className="grid gap-4 w-full p-4 border border-gray-200 rounded-lg">
                                <div className="flex h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl  bg-gray-100 ">
                                    <div
                                        className={`${previewImage && "hidden"} grid gap-2 justify-items-center p-2`}
                                    >
                                        <FaRegImages className="h-8 w-8 text-gray-400" />
                                        <p>Image preview will appear here</p>
                                    </div>

                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="preview"
                                            className="w-[90%] h-45"
                                        />
                                    )}
                                </div>

                                <h3 className="font-bold text-lg">
                                    {productName ? productName : "Product Name"}
                                </h3>
                                <span className="text-sm text-gray-300 font-bold">
                                    {productDescription
                                        ? productDescription
                                        : "Product description will appear here"}
                                </span>
                                <span className="text-2xl font-bold">
                                    NTD$ {productPrice ? productPrice : 0}
                                </span>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <FaRegCircle size={10} />
                                        <p>Color : {productColor ? productColor : "-"} </p>
                                    </div>
                                    <div className={`flex items-center gap-2`}>
                                        <FaCircle size={10} className={checkStock(stockQuantity)} />
                                        <p>Stock : {stockQuantity ? stockQuantity : "-"} </p>
                                    </div>
                                </div>
                                <span
                                    className={`
                        inline-flex min-w-[90px]
                        items-center justify-center
                        rounded-md px-3 py-1
                        text-sm font-medium
                        ${statusStyle[status]}
                    `}
                                >
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid justify-items-center w-full gap-2">
                        <button className="w-full h-10 p-2 border-2 font-bold text-[16px] hover:bg-gray-800 hover:text-white rounded-md " disabled={productForm.formState.isSubmitting}>
                            Cancel
                        </button>
                        <button onClick={() => onSubmit(productForm.getValues())} type="submit" className="w-full h-10 p-2 border-blue-500 border-2 text-blue-500 font-bold text-[16px] hover:text-white hover:bg-blue-500 rounded-md">
                            {productForm.formState.isSubmitting ? "submitting" : "Submit"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
