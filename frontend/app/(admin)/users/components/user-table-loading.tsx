import { Skeleton } from "@/components/ui/skeleton"
import { LuNotebook } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
type HeaderProps = {
    headerName: string
    style: string
}
export function Loading({ headerList, parameterNumber }: { headerList: HeaderProps[], parameterNumber: number }) {
    return (
        <table>
            <thead className='bg-gray-200 rounded-t-2xl'>
                <tr className='flex justify-start gap-2 p-3 '>
                    {
                        headerList.map((header: HeaderProps) => {
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

                {
                    Array.from({ length: 8 }, (_, index) => (
                        <tr
                            className='flex gap-2 p-3 border-b border-gray-200 max-w-full'
                            key={Math.random() * 9999999} >
                            <td className='text-left flex gap-2 flex-col items-start'>
                                <Skeleton className="h-5 w-60 bg-gray-200" />
                                <Skeleton className="h-5 w-24 bg-gray-200" />
                            </td>
                            <td className='text-left flex items-center text-md font-medium w-60 font-stretch-condensed '>
                                <Skeleton className="h-5 w-60 bg-gray-200" />
                            </td>
                            <td className='text-left flex items-center text-md font-medium w-40 font-stretch-condensed '>
                                <Skeleton className="h-5 w-40 bg-gray-200" />
                            </td>
                            <td
                                className="text-left flex items-center text-md font-medium w-30 font-stretch-condensed  "
                            >
                                <Skeleton className="h-5 w-30 bg-gray-200" />
                            </td>
                            <td className='flex items-center text-left text-md font-medium w-50 font-stretch-condensed '>
                                <Skeleton className="h-5 w-50 bg-gray-200" />
                            </td>
                            <td className='flex items-center '>
                                <Skeleton className="h-5 w-50 bg-gray-200" />
                            </td>
                            <td className='flex items-center'>
                                <Skeleton className="h-5 w-40 bg-gray-200" />
                            </td>
                            <td className='flex items-center'>
                                <Skeleton className="h-5 w-28 bg-gray-200" />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table >
    )
}


