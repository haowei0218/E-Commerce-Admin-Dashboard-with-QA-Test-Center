import { IoMdNotificationsOutline } from 'react-icons/io'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { MdKeyboardArrowDown } from 'react-icons/md'

export function Header() {
  return (
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
  )
}
