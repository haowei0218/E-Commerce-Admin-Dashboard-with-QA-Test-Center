'use client'
import PageTitle from "@/components/ui/PageTitle"
import { CreateLink, ExportButton } from "@/components/Button"
import { useState } from "react"
import { productStatus } from "@/type/products/products.base"
import { Slider } from "@/components/ui/slider"
import { SearchBox } from "@/components/Filter"
import { SelectMenu } from "@/components/SelectMenu"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "@/lib/products.api"
import { productStatusList } from "@/lib/data"
import { FilterButton } from "@/components/Filter"
import { ProductsTable } from "./components/products-table"
import { productsTableHeaders } from "@/lib/data"
import { useRouter } from "next/navigation"
import Ring from "@/components/ring"
import { Plus } from "lucide-react"
import Pagination from "@/components/Pagination"
import { exportCSV } from "@/lib/utils"
import { FiBox } from "react-icons/fi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { AiOutlineStock } from "react-icons/ai";
import { Input } from "@base-ui/react"



export default function Products() {
  const [keywords, setKeywords] = useState<string>('')
  const [status, setStatus] = useState<productStatus | 'all'>('all')
  const [price, setPrice] = useState<number>(0)
  const [lowPrice, setLowPrice] = useState<number>(0)
  const [highPrice, setHighPrice] = useState<number>(0)
  const [searchKeywords, setSearchKeywords] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [filter, setFilter] = useState<{
    keywords: string,
    status: productStatus | 'all',
    priceRange: number[]
  }>({
    keywords: '',
    status: 'all',
    priceRange: [0, 0]
  })
  const [page, setPage] = useState<number>(1)
  const router = useRouter()
  const PAGE_SIZE = 6

  const handleSerachParams = () => {
    setFilter({
      keywords: keywords,
      status: 'all',
      priceRange: [0, 0]
    })
  }

  const handleFilter = () => {
    setFilter({
      keywords: "",
      status: status,
      priceRange: [lowPrice, highPrice]
    })

  }

  const handlePriceRange = (type: 'low' | 'high', data: number) => {
    switch (type) {
      case "low":
        setLowPrice(data)
        break;
      case 'high':
        setHighPrice(data)
        break;
      default:
        break
    }
  }

  const resetFilter = () => {
    setFilter({
      keywords: '',
      status: 'all',
      priceRange: [0, 0]
    })
    setStatus('all')
    setLowPrice(0)
    setHighPrice(0)
    setKeywords('')
  }

  const productsQuery = useQuery({
    queryKey: ['products', filter, page],
    queryFn: () => fetchProducts({
      ...filter,
      page: page,
      pageSize: PAGE_SIZE
    }),
    select: (data) => ({
      products: data.getProducts.result,
      totalCount: data.getProducts.total_count,
      totalPage: Math.ceil(data.getProducts.total_count / PAGE_SIZE),
    }),
    enabled: Boolean(page)
  })

  const products = productsQuery.data?.products ?? []
  const totalPage = productsQuery.data?.totalPage ?? 1
  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return 0

    return Number(((count / total) * 100).toFixed(1))
  }

  const cardList = [
    {
      icon: <FiBox />,
      title: "Total Products",
      data: 256,
      percent: 100,
      subtile: 'all products',
      backgroundColor: "bg-blue-100 text-blue-600"
    },
    {
      icon: <MdOutlineShoppingCart />,
      title: "Published Products",
      data: 198,
      percent: calculatePercentage(198, 256),
      subtile: 'Available for purchase',
      backgroundColor: "bg-green-100 text-green-500"
    },
    {
      icon: <IoTimeOutline />,
      title: "Draft Products",
      data: 42,
      percent: calculatePercentage(42, 256),
      subtile: 'Not published yet',
      backgroundColor: "bg-orange-100 text-orange-500"
    },
    {
      icon: <AiOutlineStock />,
      title: "Low Stock Products",
      data: 8,
      percent: calculatePercentage(8, 256),
      subtile: 'Stock below 10',
      backgroundColor: "bg-red-100 text-red-500"
    }
  ]

  return (
    <div className='bg-gray-100 h-full p-5 '>
      {/* page title */}
      <div className='m-auto py-5'>
        <PageTitle
          children={
            <div className='flex gap-2'>
              <ExportButton exportFn={() => exportCSV(products, ['id', 'name', 'sku', 'price', 'stock_quantity', 'status', 'created_at', 'updated_at'], 'products')} />
              <CreateLink link="/products/create-product" buttonName="create product" />
            </div>
          }
          mainTitle='Products'
          subTitle='Manage all products in the store'
        />
      </div>


      {/* card */}

      <div className="flex justify-between items-center">
        {
          cardList.map((card) => {
            return (
              <div key={card.title} className="flex gap-2 itmes-start p-5 bg-white w-95 rounded-lg shadow shadow-gray-300">
                <div className={`flex items-center justify-center rounded-full w-15 h-15 ${card.backgroundColor} text-3xl`}>
                  {card.icon}
                </div>

                <div className="w-[80%]">
                  <h2 className="text-[16px] text-gray-500 font-bold">{card.title}</h2>
                  <div className="flex justify-between items-end w-full">
                    <p className="text-3xl font-bold">{card.data}</p>
                    <p className={`text-sm ${card.backgroundColor.includes('red') ? "text-red-500 " : "text-green-500"} font-bold`}>{card.percent}%</p>
                  </div>

                  <p className="text-sm font-bold text-slate-500">{card.subtile}</p>
                </div>
              </div>
            )
          })
        }
      </div>


      {/* filter  */}

      <div className="bg-white rounded-md p-7 mt-5 ">
        <div className="flex justify-between items-end m-auto mb-10 ">
          <SearchBox setKeyWords={setKeywords} keywords={keywords} onHandleSearch={handleSerachParams} placeholder="Search by product name 、sku or color...." />
          <SelectMenu props={productStatusList} value={status} onSelectMenuValueChange={setStatus} label="Product status" selectMenuStyle={{ width: "200px", borderColor: "text-gray-300" }} />

          <div className="flex flex-col gap-2">
            <h1 className="w-50 font-semibold text-[16px] text-gray-500">Price range</h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <p className="text-lg font-normal text-gray-700">NTD$</p>
                <Input type="number" min={0} placeholder="0" value={lowPrice} className={'w-45 h-10 border border-gray-300 rounded-md p-5'} onChange={(e) => handlePriceRange('low', Number(e.target.value))} />
              </div>
              <div className="w-10 h-0.5 bg-gray-300"></div>
              <Input type="number" min={0} placeholder="0" value={highPrice} className={'w-45 h-10 border border-gray-300 rounded-md p-5'} onChange={(e) => handlePriceRange('high', Number(e.target.value))} />
            </div>
          </div>

          <FilterButton clearFilterFn={resetFilter} FilterFn={handleFilter} />
        </div>

        {productsQuery.isLoading && <Ring className='w-10 h-10 m-auto' />}
        {/* table */}
        {products &&
          <div className='rounded-t-2xl border-t border-l border-r m-auto border-gray-200 overflow-y-auto'>
            <ProductsTable products={products} headers={productsTableHeaders} router={router} />
          </div>}



        <div className="flex justify-between items-center w-full mt-5">
          <p className="text-lg text-gray-500 font-bold">Showing 1-6 of {productsQuery.data?.totalCount} products</p>
          <Pagination setPageFn={setPage} PAGE={page} totalPage={totalPage} />
        </div>


      </div>

    </div>
  )
}
