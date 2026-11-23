import { Skeleton } from "@/components/ui/skeleton"
import { randomKey } from "@/lib/utils";
type HeaderProps = {
    headerName: string
    style: string
}
export function Loading({ headerList, parameterNumber }: { headerList: HeaderProps[], parameterNumber: number }) {
    return (
        <table className="w-full table-auto">
            <thead className="bg-gray-50">
                <tr>
                    {headerList.map((header) => (
                        <th
                            key={header.headerName}
                            className="px-4 py-3 text-left text-sm font-bold text-gray-600"
                        >
                            {header.headerName}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className='bg-white'>

                {
                    Array.from({ length: 8 }, (_, index) => (
                        <tr key={randomKey()} className="border-b border-gray-200 transition-colors hover:bg-gray-50">

                            {/* Product Name */}
                            <td className="px-4 py-3 align-middle">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 bg-gray-200" />

                                    <div className="min-w-0 grid gap-2">
                                        <Skeleton className="w-40 h-2 bg-gray-200" />
                                        <Skeleton className="w-25 h-4 bg-gray-200" />
                                    </div>
                                </div>
                            </td>

                            {/* SKU */}
                            <td className="px-4 py-3 align-middle">
                                <Skeleton className="w-30 h-6 bg-gray-200" />
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3 align-middle">
                                <Skeleton className="w-35 h-6 bg-gray-200" />
                            </td>

                            {/* Stock Quantity */}
                            <td className="px-4 py-3 align-middle">
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <Skeleton className="w-30 h-6 bg-gray-200" />
                                </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3 align-middle">
                                <Skeleton className="w-30 h-6 bg-gray-200" />
                            </td>

                            {/* Created At */}
                            <td className="px-4 py-3 align-middle">
                                <Skeleton className="w-30 h-6 bg-gray-200" />
                            </td>

                            {/* Updated At */}
                            <td className="px-4 py-3 align-middle">
                                <Skeleton className="w-30 h-6 bg-gray-200" />
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 align-middle">
                                <div className="flex items-center w-full gap-2">
                                    <Skeleton className="w-10 h-10 bg-gray-200" />
                                    <Skeleton className="w-10 h-10 bg-gray-200" />
                                </div>
                            </td>

                        </tr>
                    ))
                }
            </tbody>
        </table >
    )
}


