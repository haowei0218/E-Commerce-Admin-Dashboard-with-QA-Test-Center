import { LuChurch } from 'react-icons/lu'
import { MdDashboard, MdAdminPanelSettings } from 'react-icons/md'
import { FaWallet } from 'react-icons/fa6'
import { FaUser, FaLock } from 'react-icons/fa'
import { AiFillFile } from 'react-icons/ai'
import { IoMdSettings } from 'react-icons/io'
import { HiDocumentReport } from 'react-icons/hi'
import { TfiLayoutMediaCenterAlt } from 'react-icons/tfi'
import { IoLogOutOutline } from 'react-icons/io5'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { TbReportAnalytics } from 'react-icons/tb'
import { FiUsers } from 'react-icons/fi'
import { BsBox } from 'react-icons/bs'
import { RiTodoLine } from 'react-icons/ri'
import { IoIosMenu } from 'react-icons/io'
import NavigationBar from '@/components/ui/NavigationBar'
import DashboardCards from '@/components/ui/DashboardCards'
const sidebarIconStyle = 'text-2xl'

export const navigationBarList = [
  {
    sidebarName: 'Dashboard',
    sidebarIcon: <MdDashboard className={sidebarIconStyle} />,
    route: '/dashboard',
  },
  {
    sidebarName: 'Order',
    sidebarIcon: <FaWallet className={sidebarIconStyle} />,
    route: '/orders',
  },
  {
    sidebarName: 'Users',
    sidebarIcon: <FaUser className={sidebarIconStyle} />,
    route: '/users',
  },
  {
    sidebarName: 'Products',
    sidebarIcon: <AiFillFile className={sidebarIconStyle} />,
    route: '/products',
  },
  {
    sidebarName: 'Test Center',
    sidebarIcon: <TfiLayoutMediaCenterAlt className={sidebarIconStyle} />,
    route: '/test-center',
  },
  {
    sidebarName: 'Report',
    sidebarIcon: <HiDocumentReport className={sidebarIconStyle} />,
    route: '/report',
  },
  {
    sidebarName: 'Roles & Permissions',
    sidebarIcon: <FaLock className={sidebarIconStyle} />,
    route: '/roles-permissions',
  },
  {
    sidebarName: 'Settings',
    sidebarIcon: <IoMdSettings className={sidebarIconStyle} />,
    route: '/settings',
  },
  {
    sidebarName: 'Logout',
    sidebarIcon: <IoLogOutOutline className={sidebarIconStyle} />,
    route: '/login',
  },
]

const dashboardCards = [
  {
    title: 'Total Orders',
    value: '2356',
    icon: <TbReportAnalytics className='text-2xl text-blue-400' />,
    style: 'bg-[rgba(94,185,245,0.41)]',
  },
  {
    title: 'Total Users',
    value: '1,245',
    icon: <FiUsers className='text-2xl text-green-600' />,
    style: 'bg-[rgba(9,191,26,0.34)]',
  },
  {
    title: 'Total Products',
    value: '864',
    icon: <BsBox className='text-2xl text-purple-600' />,
    style: 'bg-[rgba(206,133,248,0.41)]',
  },
  {
    title: 'Total Runs',
    value: '128',
    icon: <RiTodoLine className='text-2xl text-yellow-600' />,
    style: 'bg-[rgba(235,159,13,0.34)]',
  },
  {
    title: 'Actives Tests',
    value: '32',
    icon: <IoIosMenu className='text-2xsssl text-blue-600' />,
    style: 'bg-[rgba(94,185,245,0.41)]',
  },
]

export default function Dashboard() {
  return (
    <div className='w-full h-full flex'>
      <NavigationBar navigaionbarList={navigationBarList} />
      <div className='main w-full flex flex-col h-full'>
        <div className='title w-full min-h-15 bg-white flex justify-end items-center text-white border-b border-gray-200'>
          <IoMdNotificationsOutline className='text-black text-3xl' />

          <div className='flex w-60 h-full gap-3 items-center justify-center'>
            <IoPersonCircleOutline className='text-black text-5xl' />
            <div className='flex flex-col justify-center items-start h-full'>
              <h1 className='text-gray-800 font-base text-base'>Admin</h1>
              <span className='text-gray-400 text-sm'>user name</span>
            </div>
            <MdKeyboardArrowDown className='text-gray-800 text-2xl ml-4' />
          </div>
        </div>

        <div className='bg-gray-50 w-full h-full p-5'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl'>
              <strong>Dashboard </strong>
            </h1>
            <span className='text-gray-400 text-sm font-bold'>
              Welcome back , Admin! Here's what's happening with your system
              today.
            </span>

            <div className='w-full h-32 flex gap-4 justify-between items-center'>
              <DashboardCards cards={dashboardCards} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
