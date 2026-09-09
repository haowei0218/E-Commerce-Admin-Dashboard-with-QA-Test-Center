import { Dispatch, SetStateAction } from "react"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

export default function Pagination(
    { setPageFn, PAGE, totalPage }: { setPageFn: Dispatch<SetStateAction<number>>, PAGE: number, totalPage: number }
) {
    return (
        <div className='w-full flex justify-center items-center mt-10'>

            <div className="w-20 flex justify-start">
                <button className="text-lg font-medium" onClick={() => setPageFn(1)}>第一頁</button>
            </div>

            <div className="w-20 flex justify-start">

                <button onClick={() => setPageFn((prev) => {
                    if (prev - 1 >= 0) {
                        return prev - 1
                    }

                    return prev
                })}>
                    <IoIosArrowBack className="text-2xl" />
                </button>
            </div>
            <div className="flex items-center gap-2">
                <div className='w-15 h-8 border border-gray-500 flex items-center justify-center rounded-md'>
                    <span className="font-bold text-black text-lg ">{PAGE}</span>
                </div>

                <p className="font-bold text-black text-lg ">/</p>

                <div className='w-15 h-8 border border-gray-500 flex items-center justify-center rounded-md'>
                    <span className="font-bold text-black text-lg ">{totalPage}</span>
                </div>
            </div>

            <div className="w-20 flex justify-end">
                <button onClick={() => setPageFn((prev) => {
                    if (prev + 1 <= totalPage) {
                        return prev + 1
                    }

                    return prev
                })}>
                    <IoIosArrowForward className="text-2xl" />
                </button>

            </div>

            <div className="w-20 flex justify-end">
                <button className="text-lg font-medium" onClick={() => setPageFn(totalPage)}>最後一頁</button>
            </div>
        </div>
    )
}