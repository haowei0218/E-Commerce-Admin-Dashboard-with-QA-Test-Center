'use client'
import { productStatus } from "@/type/products/products.base"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { formatDate } from "@/lib/utils";
import { product } from "@/type/products/products.base";
import { FaCircle } from "react-icons/fa";
import Image from "next/image";
import { MdEdit } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi"
import { BiSolidArchiveIn } from "react-icons/bi";
import { FaArchive } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MdDelete } from "react-icons/md";
import { IoArchiveOutline } from "react-icons/io5";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { updateProductStatus } from "@/lib/products.api";
import { toast } from "sonner";
export const statusStyle = {
    draft: 'text-gray-700 bg-gray-300',
    published: 'text-green-700 bg-green-300',
    unpublished: 'text-amber-700 bg-amber-300',
    archived: 'text-red-700 bg-red-300'
}



type productTableRowProps = {
    product: product
    router: AppRouterInstance
}

type headersProps = {
    headerName: string
    style: string
}

type productsTableProps = {
    products: product[]
    headers: headersProps[]
    router: AppRouterInstance
}

const stockRule = {
    InStock: "text-green-500",
    LowStock: "text-orange-500",
    CriticalStock: "text-red-500",
    OutOfStock: "text-gray-500"
}

export const checkStock = (stock: number) => {
    if (stock >= 60) {
        return stockRule.InStock
    } else if (stock > 30 && stock <= 59) {
        return stockRule.LowStock
    } else if (stock > 0 && stock < 30) {
        return stockRule.CriticalStock
    } else {
        return stockRule.OutOfStock
    }
}

export function ProductQuickAction({ id, productImage, productName, productSku }: { id: string, productImage: string, productName: string, productSku: string }) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitStatus] = useState(false)

    async function onSubmit() {
        setSubmitStatus(true)
        const result = await updateProductStatus({ id: id, status: 'archived' })
        if (result) { toast.success('下架產品成功'); setOpen(false); setSubmitStatus(false) }
    }
    return (
        <Dialog open={open} onOpenChange={(value) => {
            setOpen(value)

        }}>
            <DialogTrigger
                type="button"
                aria-label="Archive product"
                className="rounded-lg border border-red-500 p-2 text-xl text-red-500 hover:bg-red-500 hover:text-white"
            >
                <BiSolidArchiveIn aria-hidden="true" />
            </DialogTrigger>

            <DialogContent style={{
                width: "500px",
                maxWidth: "90vw",
                background: "white",
                border: 0
            }}>
                <DialogHeader>
                    <DialogTitle className='text-2xl'>
                        <button className="bg-orange-200 text-orange-500 p-2 rounded-xl w-10 h-10">
                            <FaArchive />
                        </button>
                    </DialogTitle>
                </DialogHeader>

                <div className="">
                    <h2 className="text-2xl font-normal">archive product</h2>
                    <p className="text-md font-normal m-auto text-gray-500">Confrim that you want to archive this product?</p>

                    <div className="flex bg-gray-200 rounded-lg w-full justify-start gap-2 items-start p-3 mt-5">
                        <Image src={productImage} alt={productName}
                            width={40}
                            height={40}
                            className="line-clamp-1" />
                        <div className="grid">
                            <p className="font-normal text-black text-lg">{productName}</p>
                            <p className="font-normal text-gray-500 text-sm">{productSku}</p>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-2 mt-5">
                        <button className="p-2 border rounded-lg border-gray-500 text-gray-500 font-medium hover:bg-gray-500 hover:text-white" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </button>
                        <button className="p-2 border rounded-lg border-blue-500 text-blue-500 font-medium hover:bg-blue-500 hover:text-white" type="button" onClick={() => onSubmit()}>
                            {submitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}


export function ProductsTableRow(tableRowProps: productTableRowProps) {
    const product = tableRowProps.product

    return (
        <tr className="border-b border-gray-200 transition-colors hover:bg-gray-50">

            {/* Product Name */}
            <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-3">
                    <Image
                        src={product.product_image_url}
                        alt={product.product_name}
                        width={40}
                        height={40}
                        className="w-10 h-10 shrink-0 rounded-md object-contain shadow-sm"
                    />

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                            {product.product_name}
                        </p>

                        <p className="max-w-[200px] truncate text-xs text-gray-500">
                            {product.product_description?.split("，")[0]}
                        </p>
                    </div>
                </div>
            </td>

            {/* SKU */}
            <td className="px-4 py-3 align-middle">
                <span className="inline-block whitespace-nowrap rounded-md bg-gray-200 px-2 py-1 text-sm text-gray-600">
                    {product.product_sku}
                </span>
            </td>

            {/* Price */}
            <td className="px-4 py-3 align-middle">
                <span className="whitespace-nowrap text-sm font-semibold">
                    NTD${product.product_price}
                </span>
            </td>

            {/* Stock Quantity */}
            <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <FaCircle
                        size={10}
                        className={checkStock(product.stock_quantity)}
                    />

                    <span className="text-sm font-medium">
                        {product.stock_quantity} / 個
                    </span>
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3 align-middle">
                <span
                    className={`
                        inline-flex min-w-[90px]
                        items-center justify-center
                        rounded-md px-3 py-1
                        text-sm font-medium
                        ${statusStyle[product.status]}
                    `}
                >
                    {product.status}
                </span>
            </td>

            {/* Created At */}
            <td className="px-4 py-3 align-middle">
                <span className="whitespace-nowrap text-sm text-gray-600">
                    {formatDate(product.created_at)}
                </span>
            </td>

            {/* Updated At */}
            <td className="px-4 py-3 align-middle">
                <span className="whitespace-nowrap text-sm text-gray-600">
                    {formatDate(product.updated_at)}
                </span>
            </td>

            {/* Actions */}
            <td className="px-4 py-3 align-middle">
                <div className="flex items-center w-full gap-2">

                    <Link href={`/products/edit/${product.id}`} className="p-2 flex items-center gap-2 justify-center border-blue-500 text-blue-500 border rounded-lg hover:cursor-pointer hover:bg-blue-500 hover:text-white text-lg font-bold">
                        <MdEdit />
                    </Link>
                    <ProductQuickAction id={product.id} productImage={product.product_image_url} productName={product.product_name} productSku={product.product_sku} />
                </div>
            </td>

        </tr>
    )
}

export function ProductsTable(tableProps: productsTableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[1150px] table-auto">

                <thead className="bg-gray-50">
                    <tr>
                        {tableProps.headers.map((header) => (
                            <th
                                key={header.headerName}
                                className="px-4 py-3 text-left text-sm font-bold text-gray-600"
                            >
                                {header.headerName}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="bg-white">
                    {tableProps.products.map((product) => (
                        <ProductsTableRow
                            key={product.id}
                            product={product}
                            router={tableProps.router}
                        />
                    ))}
                </tbody>

            </table>
        </div>
    )
}