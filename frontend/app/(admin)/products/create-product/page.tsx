import { FaLongArrowAltLeft } from "react-icons/fa";
import Link from "next/link";
import Breadcrumbs from "@/app/(admin)/users/components/breadcrumbs";
export default function CreateProduct() {
    return (
        <div className='bg-gray-50 h-full p-5'>
            <div className="flex justify-between items-center ">
                <Breadcrumbs action="products creator" route="products" />
                <button className="flex w-50 h-15 justify-center items-center gap-2 hover:bg-gray-300 hover:cursor-pointer border-2 border-gray-300 rounded-lg bg-white" >
                    <FaLongArrowAltLeft className="font-normal text-black" />
                    <Link href='/products' className="text-lg font-normal text-black">Back to products</Link>
                </button>
            </div>
        </div>
    )
}