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
const statusStyle = {
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

const checkStock = (stock: number) => {
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
    return (
        <tr
            className='flex justify-start gap-2 p-3 border-b border-gray-200'
            key={tableRowProps.product.id}
        >
            <td className='text-left flex items-center text-md font-medium w-70 font-stretch-condensed '>
                <div className="flex gap-2 items-start">
                    <Image src={tableRowProps.product.product_image_url} alt="product image url" className="w-10 h-10 shadow shadow-gray-300" width={40}
                        height={40} />
                    <div>
                        <p className="text-[16px] font-bold">{tableRowProps.product.product_name}</p>
                        <p className="text-gray-500 text-sm">{tableRowProps.product.product_description?.split('，')[0]}</p>
                    </div>

                </div>

            </td>
            <td className='text-left flex items-center text-md font-medium w-60 font-stretch-condensed '>
                <p className="py-1 px-2 bg-gray-300 rounded-lg text-gray-600">{tableRowProps.product.product_sku}</p>
            </td>
            <td className='text-left flex items-center text-md font-bold w-40 font-stretch-condensed '>
                NTD${tableRowProps.product.product_price}
            </td>
            <td
                className="text-left flex gap-2 items-center text-md font-medium w-45 font-stretch-condensed  "
            >
                <FaCircle size={12} className={checkStock(tableRowProps.product.stock_quantity)} /><p className="text-[16px] pt-0.5">{tableRowProps.product.stock_quantity} / 個</p>
            </td>
            <td
                className="text-left flex items-center text-md font-medium w-40 font-stretch-condensed  "
            >
                <div className={`w-25 h-6 mt-1.5 flex justify-center p-2 items-center ${statusStyle[tableRowProps.product.status]} rounded-md`}>
                    <span >{tableRowProps.product.status}</span>
                </div>
            </td>
            <td className='text-left flex items-center text-md font-medium w-50 font-stretch-condensed '>
                {formatDate(tableRowProps.product.created_at)}
            </td>
            <td className='text-left flex items-center text-md font-medium w-50 font-stretch-condensed '>
                {formatDate(tableRowProps.product.updated_at)}
            </td>
            <td className='flex items-center gap-5 text-left text-md font-black font-stretch-condensed mb-2 justify-end'>
                <button
                    className='flex items-center w-25 h-10 text-lg justify-center text-blue-500 gap-2 rounded-md font-normal border border-blue-500 px-2.5 py-1.5  hover:border-blue-900 hover:text-blue-900'
                    onClick={() => tableRowProps.router.push(`/products/details/${tableRowProps.product.id}`)}
                >
                    <MdEdit />
                    Edit
                </button>
                <ProductQuickAction />
            </td>
        </tr>)
}

export function ProductsTable(tableProps: productsTableProps) {
    return (
        <table className='w-full m-auto shadow shadow-gray-300'>
            <thead className='bg-gray-50 rounded-lg'>
                <tr className='flex gap-2 p-4 '>
                    {
                        tableProps.headers.map((header: headersProps) => {
                            return (
                                <th key={header.headerName} className={`text-left text-sm font-black font-stretch-condensed text-gray-600 ${header.style}`}>
                                    <strong>{header.headerName}</strong>
                                </th>

                            )
                        })
                    }
                </tr>
            </thead>
            <tbody className='bg-white'>
                {tableProps.products?.map((product) => {
                    return (
                        <ProductsTableRow key={product.id} product={product} router={tableProps.router} />
                    )
                })}
            </tbody>
        </table>
    )
}