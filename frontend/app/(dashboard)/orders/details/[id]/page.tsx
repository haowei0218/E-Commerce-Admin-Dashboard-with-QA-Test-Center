import { useParams } from "next/navigation";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";
import { FaLongArrowAltDown, FaLongArrowAltLeft } from "react-icons/fa";
export default function OrderDetails() {
    const params = useParams()

    return (
        <div className='bg-gray-50 w-full h-full p-5 overflow-y-auto'>
            <div className="flex items-start gap-10">
                <button className="flex items-center gap-2 hover:text-blue-900 hover:cursor-pointer">
                    <FaLongArrowAltLeft className="font-black text-blue-500" />
                    <Link href='/users' className="text-lg font-black text-blue-500">back</Link>
                </button>
                <PageTitle mainTitle="order details" subTitle="manage your order and edit details" />
            </div>
        </div>
    )

}