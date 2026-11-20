'use client'
import PageTitle from '@/components/ui/PageTitle'
import { CreateLink, ExportButton } from '@/components/Button'
import { useState } from 'react'
import { productStatus } from '@/type/products/products.base'
import { Slider } from '@/components/ui/slider'
import { SearchBox } from '@/components/Filter'
import { SelectMenu } from '@/components/SelectMenu'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/products.api'
import { productStatusList } from '@/lib/data'
import { FilterButton } from '@/components/Filter'
import { ProductsTable } from './components/products-table'
import { productsTableHeaders } from '@/lib/data'
import { useRouter } from 'next/navigation'
import Ring from '@/components/ring'
import { Plus } from 'lucide-react'
import Pagination from '@/components/Pagination'
import { exportCSV } from '@/lib/utils'
import { FiBox } from 'react-icons/fi'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { IoTimeOutline } from 'react-icons/io5'
import { AiOutlineStock } from 'react-icons/ai'
import { Input } from '@base-ui/react'
import { StatisticsCard } from '@/components/StatisticsCard'

export default function Products() {
  const [keywords, setKeywords] = useState<string>('')
  const [status, setStatus] = useState<productStatus | 'all'>('all')
  const [price, setPrice] = useState<number>(0)
  const [lowPrice, setLowPrice] = useState<number>(0)
  const [highPrice, setHighPrice] = useState<number>(0)
  const [searchKeywords, setSearchKeywords] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [filter, setFilter] = useState<{
    keywords: string
    status: productStatus | 'all'
    priceRange: number[]
  }>({
    keywords: '',
    status: 'all',
    priceRange: [0, 0],
  })
  const [page, setPage] = useState<number>(1)
  const router = useRouter()
  const PAGE_SIZE = 6

  const handleSerachParams = () => {
    setFilter({
      keywords: keywords,
      status: 'all',
      priceRange: [0, 0],
    })
  }

  const handleFilter = () => {
    setFilter({
      keywords: '',
      status: status,
      priceRange: [lowPrice, highPrice],
    })
  }

  const handlePriceRange = (type: 'low' | 'high', data: number) => {
    switch (type) {
      case 'low':
        setLowPrice(data)
        break
      case 'high':
        setHighPrice(data)
        break
      default:
        break
    }
  }

  const resetFilter = () => {
    setFilter({
      keywords: '',
      status: 'all',
      priceRange: [0, 0],
    })
    setStatus('all')
    setLowPrice(0)
    setHighPrice(0)
    setKeywords('')
  }

  const productsQuery = useQuery({
    queryKey: ['products', filter, page],
    queryFn: () =>
      fetchProducts({
        ...filter,
        page: page,
        pageSize: PAGE_SIZE,
      }),
    select: (data) => ({
      products: data.getProducts.result,
      totalCount: data.getProducts.total_count,
      totalPage: Math.ceil(data.getProducts.total_count / PAGE_SIZE),
    }),
    enabled: Boolean(page),
  })

  const products = productsQuery.data?.products ?? []
  const totalPage = productsQuery.data?.totalPage ?? 1
  const totalCount = productsQuery.data?.totalCount ?? 0
  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return 0

    return Number(((count / total) * 100).toFixed(1))
  }

  const cardList = [
    {
      icon: <FiBox />,
      title: 'Total Products',
      data: 256,
      percent: 100,
      subtitle: 'all products',
      backgroundColor: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <MdOutlineShoppingCart />,
      title: 'Published Products',
      data: 198,
      percent: calculatePercentage(198, 256),
      subtitle: 'Available for purchase',
      backgroundColor: 'bg-green-100 text-green-500',
    },
    {
      icon: <IoTimeOutline />,
      title: 'Draft Products',
      data: 42,
      percent: calculatePercentage(42, 256),
      subtitle: 'Not published yet',
      backgroundColor: 'bg-orange-100 text-orange-500',
    },
    {
      icon: <AiOutlineStock />,
      title: 'Low Stock Products',
      data: 8,
      percent: calculatePercentage(8, 256),
      subtitle: 'Stock below 10',
      backgroundColor: 'bg-red-100 text-red-500',
    },
  ]

  return (
    <div className='bg-gray-100 p-5 '>
      {/* page title */}
      <div className='m-auto py-5'>
        <PageTitle
          children={
            <div className='flex gap-2'>
              <ExportButton
                exportFn={() =>
                  exportCSV(
                    products,
                    [
                      'id',
                      'name',
                      'sku',
                      'price',
                      'stock_quantity',
                      'status',
                      'created_at',
                      'updated_at',
                    ],
                    'products'
                  )
                }
              />
              <CreateLink
                link='/products/create-product'
                buttonName='create product'
              />
            </div>
          }
          mainTitle='Products'
          subTitle='Manage all products in the store'
        />
      </div>

      {/* card */}
      <StatisticsCard cardList={cardList} />


      {/* filter  */}

      <div className='bg-white rounded-md p-7 mt-5 '>
        <div className='mb-10 grid w-full grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)_auto]'>
          <div className="min-w-0">
            <SearchBox
              setKeyWords={setKeywords}
              keywords={keywords}
              onHandleSearch={handleSerachParams}
              placeholder="Search by product name, SKU or color..."
            />
          </div>

          <div className="min-w-0">
            <SelectMenu
              props={productStatusList}
              value={status}
              onSelectMenuValueChange={setStatus}
              label="Product status"
            />
          </div>

          <div className="grid min-w-0 gap-2 sm:col-span-2 xl:col-span-1">
            <span className="font-semibold text-gray-500">Price range (NTD)</span>

            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
              <Input
                type="number"
                min={0}
                aria-label="Minimum price in NTD"
                placeholder="Min"
                value={lowPrice}
                className="h-10 w-full min-w-0 rounded-md border border-gray-300 px-3"
                onChange={(e) => handlePriceRange("low", Number(e.target.value))}
              />
              <span aria-hidden="true" className="text-gray-400">–</span>
              <Input
                type="number"
                min={0}
                aria-label="Maximum price in NTD"
                placeholder="Max"
                value={highPrice}
                className="h-10 w-full min-w-0 rounded-md border border-gray-300 px-3"
                onChange={(e) => handlePriceRange("high", Number(e.target.value))}
              />
            </div>
          </div>

          <FilterButton clearFilterFn={resetFilter} FilterFn={handleFilter} />
        </div>


        {/* table */}

        <div className='rounded-t-2xl border-t border-l border-r m-auto border-gray-200 overflow-y-auto'>
          {products && <ProductsTable
            products={products}
            headers={productsTableHeaders}
            router={router}
          />}
        </div>
        {productsQuery.isLoading && <Ring className='w-10 h-10 mt-5 m-auto' />}


        <div className='flex justify-between items-center w-full mt-5'>
          <p className='text-lg text-gray-500 font-bold'>
            Showing {page * PAGE_SIZE - 5}-{page * PAGE_SIZE > totalCount ? totalCount : page * PAGE_SIZE} of {totalCount} Result
          </p>
          <Pagination setPageFn={setPage} PAGE={page} totalPage={totalPage} />
        </div>
      </div>
    </div>
  )
}
