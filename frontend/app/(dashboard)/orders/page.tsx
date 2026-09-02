'use client'
import PageTitle from "@/components/ui/PageTitle"
import { CgExport } from "react-icons/cg"
import { FaPlus } from "react-icons/fa6"
import Link from "next/link"
import { exportCSV } from "@/lib/utils"
import { useEffect, useState } from "react"
import { SelectMenu } from "@/components/SelectMenu"
import { orderStatus, paymentStatus } from "@/type/orders/base.type"
import { ordersTableHeaders, orderStatusList, paymentStatusList } from "@/lib/data"
import { FilterButton, SearchBox } from "@/components/Filter"
import { order } from "@/type/orders/base.type"
import { getAllOrders, getOrders } from "@/lib/orders.api"
import { Ring } from '@/components/ring'
import { OrdersTable } from "./components/orders-table"
import { useRouter } from 'next/navigation'
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
export default function Orders() {

  const [keywords, setKeywords] = useState<string>('')
  const [orderStatus, setOrderStatus] = useState<orderStatus>('pending')
  const [paymentStatus, setPaymentStatus] = useState<paymentStatus>('unpaid')
  const [orders, setOrders] = useState<order[] | null>(null)
  const [PAGE, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const router = useRouter()

  function handleSearch() {
    console.log('')
  }

  async function fetchAllOrders(input: { page: number, pageSize: number }) {
    try {
      const res = await getOrders({ page: input.page, pageSize: input.pageSize })
      const orders = res.getOrders.getOrders
      setOrders(orders)
      setTotalPage(res.getOrders.total_count)
    } catch (error) {
      console.error('Get admin users failed:', error)
    }
  }

  useEffect(() => {
    fetchAllOrders({ page: PAGE, pageSize: 5 })
  }, [PAGE])

  return (
    <>
      <div className='bg-gray-50 w-full h-full p-5 overflow-y-auto'>
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
        <div className='m-auto flex justify-between items-end gap-2 mt-15 mb-10'>
          <SearchBox setKeyWords={setKeywords} keywords={keywords} onHandleSearch={handleSearch} />
          <SelectMenu props={orderStatusList} value={orderStatus} onSelectMenuValueChange={setOrderStatus} label="訂單狀態" />
          <SelectMenu
            props={paymentStatusList}
            value={paymentStatus}
            onSelectMenuValueChange={setPaymentStatus}
            label="付款狀態"
          />
          <FilterButton clearFilterFn={() => console.log('')} FilterFn={() => console.log('')} />
        </div>

        {/* table*/}
        {!orders && <Ring className='w-10 h-10 m-auto' />}
        {orders &&
          <div className='rounded-t-2xl border-t border-l border-r m-auto border-gray-200 overflow-y-auto'>
            <OrdersTable orders={orders} headers={ordersTableHeaders} router={router} />
          </div>
        }

        <div className='w-full flex justify-center items-center mt-10'>

          <div className="w-20 flex justify-start">
            <button className="text-lg font-medium" onClick={() => setPage(1)}>第一頁</button>
          </div>

          <div className="w-20 flex justify-start">

            <button onClick={() => setPage((prev) => {
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
            <button onClick={() => setPage((prev) => {
              if (prev + 1 <= totalPage) {
                return prev + 1
              }

              return prev
            })}>
              <IoIosArrowForward className="text-2xl" />
            </button>

          </div>

          <div className="w-20 flex justify-end">
            <button className="text-lg font-medium" onClick={() => setPage(totalPage)}>最後一頁</button>
          </div>
        </div>

      </div>

    </>
  )
}
