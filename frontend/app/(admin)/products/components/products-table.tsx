import { productStatus } from "@/type/products/products.base"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { formatDate } from "@/lib/utils";
import { product } from "@/type/products/products.base";
import { FaCircle } from "react-icons/fa";
import Image from "next/image";
import { MdEdit } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi"
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

export function ProductQuickAction() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Product actions"
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100"
            >
                <HiDotsVertical className="text-xl text-gray-600" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className={"bg-white rounded-lg p-1 shadow-lg "}>
                <DropdownMenuItem className="hover:bg-gray-200 text-red-500 text-[16px] font-medium"><MdDelete />Delete</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-200 text-[16px] font-medium"><IoArchiveOutline /> Archive</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
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
                <div className="flex items-center justify-center w-full">

                    <button className="w-full h-10 flex items-center gap-2 justify-center border-blue-500 text-blue-500 border rounded-md hover:cursor-pointer hover:bg-blue-500 hover:text-white text-lg font-bold">
                        <MdEdit />{" "}Edit
                    </button>
                    <ProductQuickAction />
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