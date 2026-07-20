'use client'
import NavigationBar from '@/components/ui/NavigationBar'
import { navigationBarList } from '../dashboard/page'
import { Header } from '@/components/Header'
import { CgExport } from 'react-icons/cg'
import { FaPlus } from 'react-icons/fa'
import { CiSearch } from 'react-icons/ci'
import { DropdownMenu } from '@/components/DropdownMenu'
import { useState } from 'react'

const Roles = [
  { value: 6, optionName: '工程師' },
  { value: 5, optionName: '測試人員' },
  { value: 4, optionName: '唯讀帳號' },
  { value: 3, optionName: '客服/營運人員' },
  { value: 2, optionName: '營運主管' },
  { value: 7, optionName: 'All' },
]

const Status = [
  {
    value: 'active',
    optionName: 'active',
  },
  {
    value: 'inactive',
    optionName: 'inactive',
  },
]

export default function Users() {
  const [role, setRole] = useState<string>('4')
  const [userStatus, setUserStatus] = useState<string>('active')
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

          <div className='filters min-w-[60%] flex justify-start items-center gap-2 mt-10'>
            <div className='flex min-w-85 h-9'>
              <input
                className='w-80 border-t border-l border-b h-full border-gray-300 rounded-l-lg p-4 focus:border-none'
                placeholder='search username or email'
              />
              <button className='border-t border-r border-b border-gray-300 rounded-r-lg pr-2'>
                <CiSearch className='text-2xl' />
              </button>
            </div>

            <div className='mb-5.5'>
              <label className='w-15 text-center relative z-2 top-3 left-4 border border-gray-50 bg-gray-50 font-black text-gray-500 text-xs'>
                Role
              </label>
              <DropdownMenu props={Roles} value={role} onRoleChange={setRole} />
            </div>

            <div className='mb-5.5'>
              <label className='w-15 text-center relative z-2 top-3 left-4 border border-gray-50 bg-gray-50 font-black text-gray-500 text-xs'>
                status
              </label>
              <DropdownMenu
                props={Status}
                value={userStatus}
                onRoleChange={setUserStatus}
              />
            </div>

            <div className='flex gap-2'>
              <button className='flex justify-center items-center w-25 h-9 border border-gray-300 rounded-lg bg-white gap-2 font-bold'>
                <CgExport />
                Export
              </button>
              <button className='flex justify-center items-center w-30 h-9 border border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2'>
                <FaPlus />
                add User
              </button>
            </div>
          </div>

          <div className='overflow-hidden rounded-t-2xl border border-gray-300'>
            <table className='w-full'>
              <thead className='bg-gray-200 '>
                <tr className='flex justify-between p-1'>
                  <th className='p-3 text-left'>User ID</th>
                  <th className='p-3 text-left'>Name</th>
                  <th className='p-3 text-left'>Email</th>
                  <th className='p-3 text-left'>Role</th>
                  <th className='p-3 text-left'>Status</th>
                  <th className='p-3 text-left'>Create At</th>
                  <th className='p-3 text-left'>Action</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
