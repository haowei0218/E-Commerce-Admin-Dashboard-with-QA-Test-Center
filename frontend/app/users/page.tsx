'use client'
import NavigationBar from '@/components/ui/NavigationBar'
import { navigationBarList } from '../dashboard/page'
import { Header } from '@/components/Header'
import { CgExport } from 'react-icons/cg'
import { FaPlus } from 'react-icons/fa'
import { CiSearch } from 'react-icons/ci'
import { DropdownMenu } from '@/components/DropdownMenu'
import { useState } from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

type User = {
  userid: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createAt: string
}

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

const users: User[] = [
  {
    userid: '78a3114d-0765-4c3e-8ffc-e03d0b863886',
    name: 'user25',
    email: 'test222@gmail.com',
    role: '測試人員',
    status: 'active',
    createAt: '2026-01-01',
  },
  {
    userid: '9c5a6531-9887-4b96-8269-5939989d4022',
    name: 'user2',
    email: 'user2@gmail.com',
    role: '客服/營運人員',
    status: 'inactive',
    createAt: '2026-01-01',
  },
]

export default function Users() {
  const [role, setRole] = useState<string>('4')
  const [userStatus, setUserStatus] = useState<string>('active')

  const statusStyle = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-red-100 text-red-700',
  }
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
          {/* filter*/}
          <div className='filters min-w-[60%] flex justify-start items-center gap-2 mt-10'>
            <div className='flex min-w-85 h-9'>
              <input
                className='w-80 border-t border-l border-b h-full border-gray-300 rounded-l-lg p-4 outline-none focus:outline-none focus:ring-0 focus:border-gray-300'
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
          {/* table*/}
          <div className='overflow-hidden rounded-t-2xl border-t border-l border-r border-gray-300 w-[85%]'>
            <table className='w-full'>
              <thead className='bg-gray-200'>
                <tr className='flex justify-start gap-2 p-3'>
                  <th className='text-left text-sm font-black font-stretch-condensed w-80 text-gray-600'>
                    <strong>User ID</strong>
                  </th>
                  <th className='text-left text-sm font-black font-stretch-condensed w-45 text-gray-600'>
                    <strong>Name</strong>
                  </th>
                  <th className='text-left text-sm font-black font-stretch-condensed w-60 text-gray-600'>
                    <strong>Email</strong>
                  </th>
                  <th className='text-left text-sm font-black font-stretch-condensed w-40 text-gray-600'>
                    <strong>Role</strong>
                  </th>
                  <th className='text-left text-sm font-black font-stretch-condensed w-30 text-gray-600'>
                    <strong>Status</strong>
                  </th>
                  <th className='text-left text-sm font-black font-stretch-condensed w-50 text-gray-600'>
                    <strong>Created At</strong>
                  </th>
                  <th className='text-left text-sm font-black font-stretch-condensed w-10 text-gray-600'>
                    <strong>Action</strong>
                  </th>
                </tr>
              </thead>

              <tbody className='bg-white'>
                {users.map((user) => {
                  return (
                    <tr className='flex gap-2 p-3 border-b border-gray-200'>
                      <th className='text-left text-sm font-medium w-80 font-stretch-condensed'>
                        {user.userid}
                      </th>
                      <th className='text-left text-sm font-medium w-45 font-stretch-condensed'>
                        {user.name}
                      </th>
                      <th className='text-left text-sm font-medium w-60 font-stretch-condensed'>
                        {user.email}
                      </th>
                      <th className='text-left text-sm font-medium w-40 font-stretch-condensed'>
                        {user.role}
                      </th>
                      <th
                        className={`text-left text-sm font-medium w-30 font-stretch-condensed block  h-[90%]`}
                      >
                        <div
                          className={`w-15 h-6 flex justify-center items-center ${
                            statusStyle[user.status]
                          } rounded-md`}
                        >
                          <span>{user.status}</span>
                        </div>
                      </th>
                      <th className='text-left text-sm font-medium w-50 font-stretch-condensed'>
                        {user.createAt}
                      </th>
                      <th className='text-left text-sm font-black w-10 font-stretch-condensed'>
                        <button className='text-xl font-black'>
                          <HiOutlineDotsHorizontal />
                        </button>
                      </th>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
