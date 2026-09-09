import { CgExport } from "react-icons/cg"
import Link from "next/link"
import { FaPlus } from "react-icons/fa6"
export function ExportButton({ exportFn }: { exportFn: () => void }) {
    return (
        <button className='flex justify-center items-center w-25 h-9 border border-green-500 rounded-lg bg-white gap-2 font-medium text-green-500 hover:bg-green-700 hover:text-white hover:cursor-pointer' onClick={exportFn}>
            <CgExport />
            Export
        </button>
    )
}

export function CreateLink({ link, buttonName }: { link: string, buttonName: string }) {
    return (
        <Link
            className="flex justify-center items-center w-40 h-9 border border-blue-500 rounded-lg bg-white font-medium text-blue-500 gap-2 hover:bg-blue-700 hover:text-white hover:cursor-pointer"
            href={link}
        >
            <FaPlus />
            {buttonName}
        </Link>
    )
}