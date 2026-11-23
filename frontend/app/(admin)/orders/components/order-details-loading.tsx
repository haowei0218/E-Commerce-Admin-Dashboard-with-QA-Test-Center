import { Skeleton } from "@/components/ui/skeleton"
import { LuNotebook } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { randomKey } from "@/lib/utils";
export default function OrderDetailsLoading() {
    return (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">

            {/* order items */}
            <div className={`flex flex-col gap-4 mt-5 bg-white  border border-gray-200 rounded-lg p-4`}>
                <h1 className="font-extrabold text-lg">Items<Skeleton className="h-4 w-24 bg-gray-200" /></h1>

                <div className="p-2 gap-5 flex  bg-gray-400 rounded-md">
                    <p className="text-[16px] font-bold w-75 ">Item</p>
                    <p className="text-[16px] font-bold w-60 ">Sku</p>
                    <p className="text-[16px] font-bold w-30">Unit price</p>
                    <p className="text-[16px] font-bold w-20">Qty</p>
                    <p className="text-[16px] font-bold w-30">Total</p>
                </div>
                <div className={`gap-5 flex flex-col`}>
                    {Array.from({ length: 2 }, (_, index) => (
                        <div key={randomKey()} className="flex items-center gap-4 h-40 border-b-3 border-b-gray-200">
                            <div className="w-25 h-25 flex items-center rounded-lg shadow shadow-gray-400">
                                <Skeleton className="h-24 w-24 bg-gray-200" />
                            </div>

                            <div className="flex justify-between gap-10">
                                <div className="flex flex-col gap-4 justify-center w-45 h-25">
                                    <Skeleton className="h-4 w-24 bg-gray-200" />
                                </div>

                                <div className="flex flex-col gap-4 justify-center w-53 h-25">
                                    <Skeleton className="h-4 w-24 bg-gray-200" />
                                </div>

                                <div className="flex flex-col gap-4 justify-center w-25 h-25">
                                    <Skeleton className="h-4 w-24 bg-gray-200" />
                                </div>

                                <div className="flex flex-col gap-4 justify-center w-10 h-25">
                                    <Skeleton className="h-4 w-10 bg-gray-200" />
                                </div>

                                <div className="flex flex-col gap-4 justify-center pl-4 w-30 h-25">
                                    <Skeleton className="h-4 w-24 bg-gray-200" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* order summary */}
            <div className={`flex flex-col gap-4 mt-5 bg-white  border border-gray-200 rounded-lg p-5`}>
                <div className="flex justify-between items-center">
                    <h1 className="font-extrabold text-lg">Order Summary</h1>
                    <div className={`rounded-2xl w-25 h-10 flex justify-center items-center text-sm font-bold`}>
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                    </div>
                </div>

                <div className="py-5 gap-3 flex flex-col border-b-2 border-b-gray-400">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-[15px] text-gray-500">Order Number</span>
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-[15px] text-gray-500">Order Date</span>
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-[15px] text-gray-500">Order Status</span>
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-[15px] text-gray-500">Payment Status</span>
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-[15px] text-gray-500">Shipping Status</span>
                        <div className={`rounded-2xl p-2 h-6 flex justify-center items-center text-sm font-bold`}>
                            <Skeleton className="h-4 w-24 bg-gray-400" />
                        </div>
                        <Skeleton className="h-4 w-24 bg-gray-400" />

                    </div>
                </div>

                <div className="py-5 gap-3 flex flex-col">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-[15px] text-gray-500">Items SubTotal</span>
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-[15px] text-gray-500">shipping Fee</span>
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total Amount</span>
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                    </div>
                </div>
            </div>

            {/* Shipping information */}
            <div className="flex flex-col gap-4 mt-5 bg-white w-full border border-gray-200 rounded-lg p-4">
                <h1 className="font-extrabold text-lg">Shipping Information</h1>
                <div className="flex gap-4 justify-start items-start">

                    <div className="grid gap-2 w-50">
                        <Skeleton className="h-4 w-24 bg-gray-200" />
                        <Skeleton className="h-4 w-28 bg-gray-200" />
                        <Skeleton className="h-4 w-44 bg-gray-200" />
                        <Skeleton className="h-4 w-24 bg-gray-200" />
                    </div>

                    <div className="grid gap-2 w-50">
                        <Skeleton />
                        <span className="text-sm font-bold">Shipping Status</span>
                        <div className={`w-25 h-8  flex justify-center items-center rounded-2xl text-sm font-bold`}>
                            <Skeleton className="h-8 w-25 rounded-2xl bg-gray-200" />
                        </div>
                    </div>

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Note</span>
                        <Skeleton className="h-4 w-12 bg-gray-200" />
                    </div>
                </div>
            </div>
            {/* Order TimeLine*/}
            <div className="flex flex-col gap-4 mt-10 bg-white w-full border border-gray-200 rounded-lg p-4">
                <h1 className="font-extrabold text-lg">Order TimeLine</h1>
                <div className="flex gap-4 justify-start items-start">

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4 w-100">
                            <Skeleton className="h-10 w-70 bg-gray-400" />
                        </div>
                        <div className="flex items-center gap-4 w-100">
                            <Skeleton className="h-10 w-70 bg-gray-400" />
                        </div>
                    </div>

                </div>
            </div>

            {/* Payment information */}
            <div className="w-full flex flex-col gap-4 mt-5 bg-white border border-gray-200 rounded-lg p-4">
                <h1 className="font-extrabold text-lg">Payment Information</h1>
                <div className="flex gap-4 justify-start items-start">

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Payment method</span>
                        <Skeleton className="h-4 w-50 bg-gray-400" />
                    </div>

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Payment status</span>
                        <div className={`w-25 h-8  flex justify-center items-center rounded-2xl text-sm font-bold`}>
                            <Skeleton className="h-4 w-50 bg-gray-400" />
                        </div>
                    </div>

                    <div className="grid gap-2 w-50">
                        <span className="text-sm font-bold">Total</span>
                        <Skeleton className="h-4 w-50 bg-gray-400" />
                    </div>
                </div>
            </div>
            {/* note */}
            <div className="flex flex-col gap-4 mt-5 bg-white w-full border border-gray-200 rounded-lg p-5 ">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <LuNotebook size={30} />
                        <h1 className="font-extrabold text-lg">Edit Note</h1>
                    </div>
                    <CiEdit size={30} className="hover:cursor-pointer hover:text-gray-500" />
                </div>

                <Skeleton className="m-auto h-4 w-42 bg-gray-400" />
            </div>


        </div>
    )
}