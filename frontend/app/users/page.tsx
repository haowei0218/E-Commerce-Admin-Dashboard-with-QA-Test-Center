import NavigationBar from '@/components/ui/NavigationBar'
import { navigationBarList } from '../dashboard/page'
import { Header } from '@/components/Header'
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
        </div>
      </div>
    </div>
  )
}
