import NavigationBar from "@/components/ui/NavigationBar"
import { navigationBarList } from "../dashboard/page"
import { Header } from "@/components/Header"
import PageTitle from "@/components/ui/PageTitle"
import { CgExport } from "react-icons/cg"
import { FaPlus } from "react-icons/fa6"
import Link from "next/link"
import { exportCSV } from "@/lib/utils"
export default function Order() {
  return (
    <div className='w-full h-full flex'>
      <NavigationBar navigaionbarList={navigationBarList} />
      <div className='main w-full flex flex-col h-full overflow-y-auto'>
        <Header />
        <div className='bg-gray-50 w-full h-full p-5'>
          <PageTitle
            children={
              <div className='flex gap-2'>
                <button className='flex justify-center items-center w-25 h-9 border border-gray-300 rounded-lg bg-white gap-2 font-bold hover:bg-gray-400 hover:text-white hover:cursor-pointer' >
                  <CgExport />
                  Export
                </button>
                <Link
                  className='flex justify-center items-center w-40 h-9 border border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 hover:cursor-pointer'
                  href='/users/add-user'
                >
                  <FaPlus />
                  Create Order
                </Link>
              </div>
            }
            mainTitle='Order'
            subTitle='Manage your order in system'
          />
          {/* filter*/}

          {/* table*/}

        </div>
      </div>
    </div>
  )
}
