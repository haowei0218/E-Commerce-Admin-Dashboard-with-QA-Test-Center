import NavigationBar from '@/components/ui/NavigationBar'
import { navigationBarList } from '../dashboard/page'
import { Header } from '@/components/Header'
import { CgExport } from 'react-icons/cg'
import { FaPlus } from 'react-icons/fa'
export default function Users() {
  return (
    <div className='w-full h-full flex'>
      <NavigationBar navigaionbarList={navigationBarList} />
      <div className='main w-full flex flex-col h-full'>
        <Header />
        <div className='bg-gray-50 w-full h-full p-5'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl'>
              <strong>Users</strong>
            </h1>
            <span className='text-gray-400 text-sm font-bold'>
              Manage all system users.
            </span>
          </div>

          <div className='buttons w-[80%] flex justify-end gap-2 mt-20'>
            <button className='flex justify-center items-center w-25 h-9 border border-gray-200 rounded-sm bg-white gap-2 font-bold'>
              <CgExport />
              Export
            </button>
            <button className='flex justify-center items-center w-30 h-9 border border-gray-200 rounded-sm bg-blue-500 font-bold text-white gap-2'>
              <FaPlus />
              add User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
