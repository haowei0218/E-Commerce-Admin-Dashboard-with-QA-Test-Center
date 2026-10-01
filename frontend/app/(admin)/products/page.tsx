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
export default function Products() {
  const [keywords, setKeywords] = useState<string>('')
  const [status, setStatus] = useState<productStatus | 'all'>('all')
  const [price, setPrice] = useState<number>(0)
  const [searchKeywords, setSearchKeywords] = useState('')
  const [filter, setFilter] = useState<{
    keywords: string,
    status: productStatus | 'all',
    price: number
  }>({
    keywords: '',
    status: 'all',
    price: 0
  })
  const [page, setPage] = useState<number>(1)
  const router = useRouter()
  const PAGE_SIZE = 6

  const handleSerachParams = () => {
    setFilter({
      keywords: keywords,
      status: 'all',
      price: 0
    })
  }

  const handleFilter = () => {
    setFilter({
      keywords: "",
      status: status,
      price: price
    })
  }

  const resetFilter = () => {
    setFilter({
      keywords: '',
      status: 'all',
      price: 0
    })
    setStatus('all')
    setPrice(0)
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

  return (
    <div className='bg-gray-50 h-full p-5 '>
      {/* page title */}
      <div className='border border-gray-200 rounded-lg p-5 bg-white m-auto'>
        <PageTitle
          children={
            <div className='flex gap-2'>
              <ExportButton exportFn={() => console.log('')} />
              <CreateLink link="/products/create-product" buttonName="create product" />
            </div>
          }
          mainTitle='Products'
          subTitle='Manage all products.'
        />
      </div>

      {/* filter  */}
      <div className="flex justify-between items-end m-auto mb-10 mt-15">
        <SearchBox setKeyWords={setKeywords} keywords={keywords} onHandleSearch={handleSerachParams} />
        <SelectMenu props={productStatusList} value={status} onSelectMenuValueChange={setStatus} label="Product status" />

        <div className="flex flex-col gap-2">
          <h1 className="w-20 font-semibold text-black text-lg">Price</h1>

          <div className="flex items-center justify-between">
            <span>NTD$ 0</span>
            <span>NTD$ {price}</span>
          </div>

          <Slider
            min={0}
            max={30000}
            step={100}
            value={price}

            onValueChange={(value) => {
              if (typeof value === "number") {
                setPrice(value)
              }
            }}
            className="w-120 h-4"
          />

        </div>

        <FilterButton clearFilterFn={resetFilter} FilterFn={handleFilter} />
      </div>

      {/* table */}
      {!products && <Ring className='w-10 h-10 m-auto' />}
      {products &&
        <div className='rounded-t-2xl border-t border-l border-r m-auto border-gray-200 overflow-y-auto'>
          <ProductsTable products={products} headers={productsTableHeaders} router={router} />
        </div>
      }

      <Pagination setPageFn={setPage} PAGE={page} totalPage={totalPage} />
    </div>
  )
}
