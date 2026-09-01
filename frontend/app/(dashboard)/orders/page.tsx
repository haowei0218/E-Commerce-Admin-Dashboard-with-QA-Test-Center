'use client'
import PageTitle from "@/components/ui/PageTitle"
import { CgExport } from "react-icons/cg"
import { FaPlus } from "react-icons/fa6"
import Link from "next/link"
import { exportCSV } from "@/lib/utils"
import { useState } from "react"
import { CiFilter, CiSearch } from "react-icons/ci"
import { DropdownMenu } from "@/components/DropdownMenu"
import { orderStatus, paymentStatus } from "@/type/orders/base.type"
import { orderStatusList, paymentStatusList } from "@/lib/data"
export default function Orders() {

  const [keywords, setKeywords] = useState<string>('')
  const [orderStatus, setOrderStatus] = useState<orderStatus>('pending')
  const [paymentStatus, setPaymentStatus] = useState<paymentStatus>('unpaid')

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
      <div className='m-auto flex justify-between items-end gap-2 mt-15 h-15'>
        <div className='flex w-120'>
          <input
            className='border-t border-l border-b w-full h-12 border-gray-300 bg-white rounded-l-lg p-4 outline-none focus:outline-none focus:ring-0 focus:border-gray-300'
            placeholder='search username or email'
            onChange={(e) => setKeywords(e.target.value)}
            value={keywords}
          />
          <button
            className='border-t border-r border-b bg-white border-gray-300 rounded-r-lg pr-2'
            onClick={() => console.log('')}
          >
            <CiSearch className='text-2xl' />
          </button>
        </div>

        <div className='w-120 grid gap-2'>
          <label className='w-20 text-center font-normal text-black text-lg'>
            訂單狀態
          </label>
          <DropdownMenu props={orderStatusList} value={orderStatus} onRoleChange={setOrderStatus} />
        </div>

        <div className='w-120 grid gap-2'>
          <label className='w-20 text-center font-normal text-black text-lg'>
            付款狀態
          </label>
          <DropdownMenu
            props={paymentStatusList}
            value={paymentStatus}
            onRoleChange={setPaymentStatus}
          />
        </div>

        <div className='flex gap-2'>
          <button
            className='flex justify-center items-center w-25 h-12  bg-gray-400 rounded-lg gap-2 font-bold hover:bg-gray-500 text-white hover:cursor-pointer'
            onClick={() => console.log('')}
          >
            Clear
          </button>
          <button
            className='flex justify-center items-center w-30 h-12  bg-blue-700 rounded-lg gap-2 font-bold hover:bg-blue-800 text-white hover:cursor-pointer'
            onClick={() => console.log('')}
          >
            <CiFilter />
            Filter
          </button>
        </div>
      </div>

      {/* table*/}

    </div>

  )
}
