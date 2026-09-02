
import { TbReportAnalytics } from 'react-icons/tb'
import { FiUsers } from 'react-icons/fi'
import { BsBox } from 'react-icons/bs'
import { RiTodoLine } from 'react-icons/ri'
import { IoIosMenu } from 'react-icons/io'
import DashboardCards from '@/components/DashboardCards'

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
  )
}
