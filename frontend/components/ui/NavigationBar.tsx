import { MdAdminPanelSettings } from 'react-icons/md'
import Link from 'next/link'
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
          return (
            <Link
              href={bar.route}
              key={bar.route}
              className='min-w-full min-h-10 flex justify-start items-center gap-2 hover:bg-blue-700 hover:cursor-pointer rounded-xl text-white text-base font-medium p-2'
            >
              {bar.sidebarIcon}
              <span>
                <strong>{bar.sidebarName}</strong>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
