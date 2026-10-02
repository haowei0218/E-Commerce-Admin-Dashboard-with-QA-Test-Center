import { productStatus } from "@/type/products/products.base"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { formatDate } from "@/lib/utils";
const statusStyle = {
    draft: 'text-gray-500 bg-gray-300',
    published: 'text-green-500 bg-green-300',
    unpublished: 'text-amber-500 bg-amber-300',
    archived: 'text-red-500 bg-red-500'
}

type product = {
    id: string
    product_name: string
    product_sku: string
    product_price: string
    stock_quantity: number
    status: productStatus
    created_at: string
    updated_at: string
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

export function ProductsTableRow(tableRowProps: productTableRowProps) {
    return (
        <tr
            className='flex gap-2 p-3 border-b border-gray-200'
            key={tableRowProps.product.id}
        >
            <td className='text-left flex items-center text-md font-medium w-80 font-stretch-condensed'>
                {tableRowProps.product.id.slice(0, 28) + "..."}
            </td>
            <td className='text-left flex items-center text-md font-medium w-40 font-stretch-condensed '>
                {tableRowProps.product.product_name}
            </td>
            <td className='text-left flex items-center text-md font-medium w-60 font-stretch-condensed '>
                {tableRowProps.product.product_sku}
            </td>
            <td className='text-left flex items-center text-md font-medium w-40 font-stretch-condensed '>
                NTD${tableRowProps.product.product_price}
            </td>
            <td
                className="text-left flex items-center text-md font-medium w-35 font-stretch-condensed  "
            >
                {tableRowProps.product.stock_quantity} / 個
            </td>
            <td
                className="text-left flex items-center text-md font-medium w-30 font-stretch-condensed  "
            >
                <div className={`w-25 h-6 mt-1.5 flex justify-center items-center ${statusStyle[tableRowProps.product.status]} rounded-md`}>
                    <span >{tableRowProps.product.status}</span>
                </div>
            </td>
            <td className='text-left flex items-center text-md font-medium w-50 font-stretch-condensed '>
                {formatDate(tableRowProps.product.created_at)}
            </td>
            <td className='text-left flex items-center text-md font-medium w-50 font-stretch-condensed '>
                {formatDate(tableRowProps.product.updated_at)}
            </td>
            <td className='flex items-start gap-2 text-left text-md font-black font-stretch-condensed mb-2 '>
                <button
                    className='flex items-center justify-center text-white bg-amber-500 p-1 gap-2 rounded-md font-normal border border-gray-200 px-2.5 py-1.5  hover:bg-amber-600'
                    onClick={() => tableRowProps.router.push(`/products/details/${tableRowProps.product.id}`)}
                >
                    edit
                </button>
            </td>
        </tr>)
}

export function ProductsTable(tableProps: productsTableProps) {
    return (
        <table className='w-full '>
            <thead className='bg-gray-200 rounded-t-2xl'>
                <tr className='flex justify-start gap-2 p-3 '>
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