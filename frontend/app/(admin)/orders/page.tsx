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
import Pagination from "@/components/Pagination"
import { useQuery } from "@tanstack/react-query"
import { ExportButton } from "@/components/Button"
import { CreateLink } from "@/components/Button"
export default function Orders() {

  const [keywords, setKeywords] = useState<string>('')
  const [orderStatus, setOrderStatus] = useState<orderStatus>('pending')
  const [paymentStatus, setPaymentStatus] = useState<paymentStatus>('unpaid')
  const [PAGE, setPage] = useState<number>(1)
  const router = useRouter()

  function handleSearch() {
    console.log('')
  }

  const ordersQuery = useQuery({
    queryKey: ['all-orders', PAGE],
    queryFn: () => getOrders({ page: PAGE, pageSize: 5 }),
    enabled: Boolean(PAGE),
  })

  const ordersResponse = ordersQuery.data?.getOrders
  const orders = ordersResponse?.result ?? []
  const totalPage = Math.ceil(
    (ordersResponse?.total_count ?? 0) / 5
  )

  return (
    <>
      <div className='bg-gray-50 w-full h-full p-5 overflow-y-auto'>

        {/* page title */}
        <div className='border border-gray-200 rounded-lg p-5 bg-white m-auto'>
          <PageTitle
            children={
              <div className='flex gap-2'>
                <ExportButton exportFn={() => console.log('')} />
                <CreateLink link='/orders/add-order' buttonName="Create Order" />
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
        <Pagination totalPage={totalPage} PAGE={PAGE} setPageFn={setPage} />
      </div>

    </>
  )
}
