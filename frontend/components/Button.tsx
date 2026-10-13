import { CgExport } from "react-icons/cg"
import Link from "next/link"
import { FaPlus } from "react-icons/fa6"
export function ExportButton({ exportFn }: { exportFn: () => void }) {
    return (
        <button className='flex justify-center items-center w-28 h-12 rounded-lg gap-2 font-medium border-2 border-blue-600 text-blue-600  bg-white hover:border-3 hover:text-blue-800 hover:border-blue-800 hover:cursor-pointer' onClick={exportFn}>
            <CgExport />
            Export
        </button>
    )
}

export function CreateLink({ link, buttonName }: { link: string, buttonName: string }) {
    return (
        <Link
            className="flex justify-center items-center w-45 h-12  rounded-lg font-normal text-lg  gap-3 bg-blue-600 text-white  hover:bg-blue-700 hover:cursor-pointer"
            href={link}
        >
            <FaPlus />
            {buttonName}
        </Link>
    )
}