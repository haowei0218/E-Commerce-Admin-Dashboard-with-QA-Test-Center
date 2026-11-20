'use client'
import PageTitle from "@/components/ui/PageTitle"
import { CgExport } from "react-icons/cg"
import { FaPlus } from "react-icons/fa6"
import Link from "next/link"
import { exportCSV } from "@/lib/utils"
import { useEffect, useState } from "react"
import { SelectMenu } from "@/components/SelectMenu"
import { orderStatus, paymentStatus, shippingStatus } from "@/type/orders/base.type"
import { ordersTableHeaders, orderStatusList, paymentStatusList, shippingStatusList } from "@/lib/data"
import { FilterButton, SearchBox } from "@/components/Filter"
import { order } from "@/type/orders/base.type"
import { getAllOrders, getOrders, getOrdersStatistics } from "@/lib/orders.api"
import { Ring } from '@/components/ring'
import { OrdersTable } from "./components/orders-table"
import { useRouter } from 'next/navigation'
import Pagination from "@/components/Pagination"
import { useQuery } from "@tanstack/react-query"
import { ExportButton } from "@/components/Button"
import { CreateLink } from "@/components/Button"
import { calculatePercentage } from "@/lib/utils"

import { MdOutlineShoppingCart } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { StatisticsCard } from "@/components/StatisticsCard"
import { FcProcess } from "react-icons/fc";
export default function Orders() {

  const [keywords, setKeywords] = useState<string>('')
  const [orderStatus, setOrderStatus] = useState<orderStatus | 'all'>('all')
  const [paymentStatus, setPaymentStatus] = useState<paymentStatus | 'all'>('all')
  const [shippingStatus, setShippingStatus] = useState<shippingStatus | 'all'>('all')
  const [searchKeywords, setSearchKeywords] = useState<string>('')
  const [filter, setFilter] = useState<{
    keyword: string
    payment_status: paymentStatus | 'all'
    order_status: orderStatus | 'all'
    shipping_status: shippingStatus | 'all'
  }>({
    keyword: "",
    payment_status: 'all',
    order_status: 'all',
    shipping_status: 'all'
  })
  const [page, setPage] = useState<number>(1)
  const PAGE_SIZE = 6
  const router = useRouter()

  function handleSearch() {
    setFilter({
      keyword: keywords,
      payment_status: 'all',
      order_status: 'all',
      shipping_status: 'all'
    })
  }

  function handleFilter() {
    setFilter({
      keyword: "",
      payment_status: paymentStatus,
      order_status: orderStatus,
      shipping_status: shippingStatus
    })
  }

  function resetFilter() {
    setFilter({
      keyword: "",
      payment_status: "all",
      order_status: "all",
      shipping_status: 'all'
    }
    )

    setKeywords('')
    setOrderStatus('all')
    setPaymentStatus('all')
    setShippingStatus('all')
  }

  const ordersStatisticsQuery = useQuery({
    queryKey: ['orders-statistics'],
    queryFn: () => getOrdersStatistics()
  })

  const statistics = ordersStatisticsQuery.data?.getOrdersStatistics

  const ordersQuery = useQuery({
    queryKey: ['all-orders', page, filter],
    queryFn: () => getOrders({ keyword: keywords, order_status: orderStatus, payment_status: paymentStatus, shipping_status: shippingStatus, page: page, pageSize: PAGE_SIZE }),
    enabled: Boolean(page),
  })

  const ordersResponse = ordersQuery.data?.getOrders
  const orders = ordersResponse?.result ?? []
  const totalPage = Math.ceil(
    (ordersResponse?.total_count ?? 0) / 6
  )
  const totalCount = ordersResponse?.total_count ?? 0

  const cardList = [
    {
      icon: <MdOutlineShoppingCart />,
      title: 'Total Orders',
      data: statistics?.total_orders ?? 0,
      percent: 100,
      subtitle: 'compare with last month',
      backgroundColor: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <IoTimeOutline />,
      title: 'Pending Orders',
      data: statistics?.pending_orders ?? 0,
      percent: calculatePercentage(statistics?.pending_orders ?? 0, statistics?.total_orders ?? 0),
      subtitle: 'Awaiting processing',
      backgroundColor: 'bg-green-100 text-green-500',
    },
    {
      icon: <FcProcess />,
      title: 'Processing Orders',
      data: statistics?.processing_orders ?? 0,
      percent: calculatePercentage(statistics?.processing_orders ?? 0, statistics?.total_orders ?? 0),
      subtitle: 'Total processing orders',
      backgroundColor: 'bg-purple-100 text-purple-500',
    },
    {
      icon: <FaRegCheckCircle />,
      title: 'Completed Orders',
      data: statistics?.completed_orders ?? 0,
      percent: calculatePercentage(statistics?.completed_orders ?? 0, statistics?.total_orders ?? 0),
      subtitle: 'Successfully fulfilled',
      backgroundColor: 'bg-orange-100 text-orange-500',
    },
    {
      icon: <GiCancel />,
      title: 'Cancelled Orders',
      data: statistics?.cancelled_orders ?? 0,
      percent: calculatePercentage(statistics?.cancelled_orders ?? 0, statistics?.total_orders ?? 0),
      subtitle: 'Total cancelled',
      backgroundColor: 'bg-red-100 text-red-500',
    },

  ]

  return (
    <>
      <div className='bg-gray-50 p-5'>

        {/* page title */}
        <div className='m-auto py-5'>
          <PageTitle
            children={
              <div className='flex gap-2'>
                <ExportButton exportFn={() => exportCSV(orders, ["id", "order_number", "customer_id", "total_amount", 'order_status', 'payment_status', 'shipping_status', 'payment_method'], "orders")} />
              </div>
            }
            mainTitle='Orders'
            subTitle='Manage all system orders.'
          />
        </div>

        <StatisticsCard cardList={cardList} />
        <div className='bg-white rounded-md p-7 mt-5 '>
          <div className='m-auto grid w-full grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto] items-end gap-2 mb-10'>
            <SearchBox setKeyWords={setKeywords} keywords={keywords} onHandleSearch={handleSearch} />
            <SelectMenu props={orderStatusList} value={orderStatus} onSelectMenuValueChange={setOrderStatus} label="Order Status" />
            <SelectMenu
              props={paymentStatusList}
              value={paymentStatus}
              onSelectMenuValueChange={setPaymentStatus}
              label="Payment Status"
            />
            <SelectMenu
              props={shippingStatusList}
              value={shippingStatus}
              onSelectMenuValueChange={setShippingStatus}
              label="Shippping Status"
            />
            <FilterButton clearFilterFn={resetFilter} FilterFn={handleFilter} />
          </div>

          {/* table*/}
          {!orders && <Ring className='w-10 h-10 m-auto' />}
          {orders &&
            <div className='rounded-t-2xl border-t border-l border-r m-auto border-gray-200 overflow-y-auto'>
              <OrdersTable orders={orders} headers={ordersTableHeaders} router={router} />
            </div>
          }
          <div className='flex justify-between items-center w-full mt-5'>
            <p className='text-lg text-gray-500 font-bold'>
              Showing {page * PAGE_SIZE - 5}-{page * PAGE_SIZE > totalCount ? totalCount : page * PAGE_SIZE} of {totalCount} Result
            </p>
            <Pagination totalPage={totalPage} PAGE={page} setPageFn={setPage} />
          </div>

        </div>


      </div>

    </>
  )
}
