'use client'
import NavigationBar from '@/components/ui/NavigationBar'
import { navigationBarList } from '../dashboard/page'
import { Header } from '@/components/Header'
import { CgExport } from 'react-icons/cg'
import { FaPlus } from 'react-icons/fa'
import { CiSearch } from 'react-icons/ci'
import { DropdownMenu } from '@/components/DropdownMenu'
import { useEffect, useState } from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { adminUserProfile } from '@/type/adminUser.type'
import { getAdminUserByProperties, getUsers } from '@/lib/user.api'
import { Ring } from '@/components/ring'
import { CiFilter } from 'react-icons/ci'
import { useRouter } from 'next/navigation'
import { CiEdit } from 'react-icons/ci'
import PageTitle from '@/components/ui/PageTitle'
import Link from 'next/link'
import { MdBlock } from 'react-icons/md'
const Roles = [
  { value: '6', optionName: '工程師' },
  { value: '5', optionName: '測試人員' },
  { value: '4', optionName: '唯讀帳號' },
  { value: '3', optionName: '客服/營運人員' },
  { value: '2', optionName: '營運主管' },
  { value: '1', optionName: '管理員' },
  { value: 'All', optionName: 'All' },
]

const Status = [
  {
    value: 'Active',
    optionName: 'Active',
  },
  {
    value: 'Inactive',
    optionName: 'Inactive',
  },
  {
    value: 'All',
    optionName: 'All',
  },
]

export function formatDate(value: string | number | Date) {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(Number(value)))
}

export default function Users() {
  const [role, setRole] = useState<string>('All')
  const [userStatus, setUserStatus] = useState<string>('All')
  const [keywords, setKeywords] = useState<string>('')
  const [Users, setUsers] = useState<adminUserProfile[] | null>(null)
  const router = useRouter()

  async function handleAdminUserFilter(type: 'Filter' | 'Search') {
    const variables = {
      keyword: type === 'Filter' ? null : keywords.trim(),
      roleId: type === 'Search' ? null : role === 'All' ? null : Number(role),
      status:
        type === 'Search' ? null : userStatus === 'All' ? null : userStatus,
    }
    const result = await getAdminUserByProperties(variables)
    if (result.GetAdminUserByProperties.getUsers) {
      setUsers(result.GetAdminUserByProperties.getUsers)
    }
  }

  async function resetFilter() {
    setRole('All')
    setUserStatus('All')
    setKeywords('')

    async function fetchAdminUsers() {
      try {
        const res = await getUsers()
        const adminUsers = res.GetAdminUsers.getUsers
        setUsers(adminUsers)
        console.log('users:', adminUsers)
      } catch (error) {
        console.error('Get admin users failed:', error)
      }
    }

    fetchAdminUsers()
  }

  useEffect(() => {
    async function fetchAdminUsers() {
      try {
        const res = await getUsers()
        const adminUsers = res.GetAdminUsers.getUsers
        setUsers(adminUsers)
        console.log('users:', adminUsers)
      } catch (error) {
        console.error('Get admin users failed:', error)
      }
    }

    fetchAdminUsers()
  }, [])

  const statusStyle = {
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-red-100 text-red-700',
  }
  return (
    <div className='w-full h-full flex'>
      <NavigationBar navigaionbarList={navigationBarList} />
      <div className='main w-full flex flex-col h-full'>
        <Header />
        <div className='bg-gray-50 w-full h-full p-5'>
          <PageTitle
            children={
              <div className='flex gap-2'>
                <button className='flex justify-center items-center w-25 h-9 border border-gray-300 rounded-lg bg-white gap-2 font-bold'>
                  <CgExport />
                  Export
                </button>
                <Link
                  className='flex justify-center items-center w-30 h-9 border border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 hover:cursor-pointer'
                  href='/users/add-user'
                >
                  <FaPlus />
                  add User
                </Link>
              </div>
            }
            mainTitle='Users'
            subTitle='Manage all system users.'
          />
          {/* filter*/}
          <div className='filters min-w-[60%] flex justify-start items-center gap-2 mt-10'>
            <div className='flex min-w-85 h-9'>
              <input
                className='w-80 border-t border-l border-b h-full border-gray-300 bg-white rounded-l-lg p-4 outline-none focus:outline-none focus:ring-0 focus:border-gray-300'
                placeholder='search username or email'
                onChange={(e) => setKeywords(e.target.value)}
                value={keywords}
              />
              <button
                className='border-t border-r border-b bg-white border-gray-300 rounded-r-lg pr-2'
                onClick={() => handleAdminUserFilter('Search')}
              >
                <CiSearch className='text-2xl' />
              </button>
            </div>

            <div className='mb-5.5'>
              <label className='w-15 text-center relative z-2 top-3 left-4 border border-gray-50 bg-white font-black text-gray-500 text-xs'>
                Role
              </label>
              <DropdownMenu props={Roles} value={role} onRoleChange={setRole} />
            </div>

            <div className='mb-5.5'>
              <label className='w-15 text-center relative z-2 top-3 left-4 border border-gray-50 bg-white font-black text-gray-500 text-xs'>
                status
              </label>
              <DropdownMenu
                props={Status}
                value={userStatus}
                onRoleChange={setUserStatus}
              />
            </div>

            <div className='flex gap-2'>
              <button
                className='flex justify-center items-center w-25 h-9 border border-gray-300 rounded-lg bg-white gap-2 font-bold hover:bg-gray-500 hover:text-white hover:cursor-pointer'
                onClick={resetFilter}
              >
                Clear
              </button>
              <button
                className='flex justify-center items-center w-30 h-9 border border-gray-300 rounded-lg bg-white gap-2 font-bold hover:bg-gray-500 hover:text-white hover:cursor-pointer'
                onClick={() => handleAdminUserFilter('Filter')}
              >
                <CiFilter />
                Filter
              </button>
            </div>
          </div>
          {/* table*/}
          {!Users && <Ring className='w-10 h-10 m-auto' />}
          {Users && (
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
                  {Users?.map((user) => {
                    return (
                      <tr
                        className='flex gap-2 p-3 border-b border-gray-200'
                        key={user.id + user.email}
                      >
                        <th className='text-left text-sm font-medium w-80 font-stretch-condensed'>
                          {user.id}
                        </th>
                        <th className='text-left text-sm font-medium w-45 font-stretch-condensed'>
                          {user.name}
                        </th>
                        <th className='text-left text-sm font-medium w-60 font-stretch-condensed'>
                          {user.email}
                        </th>
                        <th className='text-left text-sm font-medium w-40 font-stretch-condensed'>
                          {user.code}
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
                          {formatDate(user.create_at)}
                        </th>
                        <th className='flex items-start gap-2 text-left text-sm font-black font-stretch-condensed mb-2'>
                          <button
                            className='flex items-center gap-2 text-xl font-black border border-gray-200 rounded-sm  hover:bg-gray-500 bg:text-white hover:cursor-pointer'
                            onClick={() => router.push('/users/edit-user')}
                          >
                            <CiEdit className='m-auto' />
                          </button>
                          <button className='flex items-center gap-2 text-xl font-black border border-gray-200 rounded-sm  hover:bg-gray-500 bg:text-white hover:cursor-pointer'>
                            <MdBlock className='m-auto' />
                          </button>
                        </th>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
