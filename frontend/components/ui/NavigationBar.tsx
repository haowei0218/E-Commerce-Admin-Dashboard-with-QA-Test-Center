'use client'
import { MdAdminPanelSettings } from 'react-icons/md'
import Link from 'next/link'
import { adminUserLogout } from '@/lib/user.api'
import { useRouter } from 'next/navigation'
type navigationBar = {
  sidebarName: string
  sidebarIcon: React.ReactNode
  route: string
}



export default function NavigationBar({
  navigaionbarList,
}: {
  navigaionbarList: navigationBar[]
}) {

  const router = useRouter()
  async function handleLogout() {
    try {
      await adminUserLogout()
      router.replace('/login')
      router.refresh()
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className='NavigationBar w-[18%] flex flex-col gap-5 items-center h-full bg-[#0B1629]'>
      <div className='title w-62.5 min-h-20 flex justify-start items-center text-white'>
        <MdAdminPanelSettings className='text-blue-500 text-4xl' />
        <h1 className='text-base font-medium'>
          <strong>E-Commerce-Admin</strong>
        </h1>
      </div>
      <div className='childrenbar w-62.5 gap-6 flex flex-col justify-center'>
        {navigaionbarList.map((bar) => {
          if (bar.sidebarName === 'Logout') {
            return (
              <button
                key={bar.sidebarName}

                onClick={handleLogout}
              >
                <Link
                  href={bar.route}
                  key={bar.route}
                  className='min-w-full min-h-10 flex justify-start items-center gap-2 hover:bg-blue-700 hover:cursor-pointer rounded-xl text-gray-400 text-lg font-medium p-2'
                >
                  {bar.sidebarIcon}
                  <span>
                    {bar.sidebarName}
                  </span>
                </Link>
              </button>
            )
          }
          return (
            <button key={bar.sidebarName} >
              <Link
                href={bar.route}
                key={bar.route}
                className='min-w-full min-h-10 flex justify-start items-center gap-2 hover:bg-blue-700 hover:cursor-pointer rounded-xl text-gray-400 text-lg font-medium p-2'
              >
                {bar.sidebarIcon}
                <span>
                  {bar.sidebarName}
                </span>
              </Link>
            </button>

          )
        })}
      </div>
    </div>
  )
}
