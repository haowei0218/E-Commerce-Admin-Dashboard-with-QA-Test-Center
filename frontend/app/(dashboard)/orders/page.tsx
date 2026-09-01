'use client'
import PageTitle from "@/components/ui/PageTitle"
import { CgExport } from "react-icons/cg"
import { FaPlus } from "react-icons/fa6"
import Link from "next/link"
import { exportCSV } from "@/lib/utils"
export default function Orders() {
  return (
    <div className='bg-gray-50 w-full h-full p-5 '>
      <div className='border border-gray-200 rounded-lg p-5 bg-white m-auto'>
        <PageTitle
          children={
            <div className='flex gap-2'>
              <button className='flex justify-center items-center w-25 h-9 border border-gray-300 rounded-lg bg-white gap-2 font-medium hover:bg-gray-400 hover:text-white hover:cursor-pointer' onClick={() => console.log('')}>
                <CgExport />
                Export
              </button>
              <Link
                className='flex justify-center items-center w-40 h-9 border border-gray-300 rounded-lg bg-blue-500 font-medium text-white gap-2 hover:bg-blue-700 hover:cursor-pointer'
                href='/users/add-order'
              >
                <FaPlus />
                Create Order
              </Link>
            </div>
          }
          mainTitle='Orders'
          subTitle='Manage all system orders.'
        />
      </div>

      {/* filter*/}


      {/* table*/}

    </div>

  )
}
