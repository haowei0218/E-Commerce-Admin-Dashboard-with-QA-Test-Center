'use client'
import NavigationBar from '@/components/ui/NavigationBar'
import { navigationBarList } from '../dashboard/page'
import { Header } from '@/components/Header'
import { CgExport } from 'react-icons/cg'
import { FaPlus } from 'react-icons/fa'
import { CiSearch } from 'react-icons/ci'
import { DropdownMenu } from '@/components/DropdownMenu'
import { useEffect, useState } from 'react'
import { adminUserProfile } from '@/type/adminUser.type'
import { getAdminUserByProperties, getUsers } from '@/lib/user.api'
import { Ring } from '@/components/ring'
import { CiFilter } from 'react-icons/ci'
import { useRouter } from 'next/navigation'
import PageTitle from '@/components/ui/PageTitle'
import Link from 'next/link'
import { UsersTable } from './components/users-table'
import { exportCSV } from '@/lib/utils'
import { Roles, Status, Headers } from '@/lib/data'


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

  async function fetchAdminUsers() {
    try {
      const res = await getUsers()
      const adminUsers = res.GetAdminUsers.getUsers
      setUsers(adminUsers)
    } catch (error) {
      console.error('Get admin users failed:', error)
    }
  }

  async function resetFilter() {
    setRole('All')
    setUserStatus('All')
    setKeywords('')
    fetchAdminUsers()
  }

  useEffect(() => {
    fetchAdminUsers()
  }, [])


  return (
    <div className='bg-gray-50 w-full h-full p-5 '>
      <div className='border border-gray-200 rounded-lg p-5 bg-white m-auto'>
        <PageTitle
          children={
            <div className='flex gap-2'>
              <button className='flex justify-center items-center w-25 h-9 border border-gray-300 rounded-lg bg-white gap-2 font-medium hover:bg-gray-400 hover:text-white hover:cursor-pointer' onClick={() => exportCSV(Users, ["id", "name", "email", "status", 'code', 'create_at'], "users")}>
                <CgExport />
                Export
              </button>
              <Link
                className='flex justify-center items-center w-40 h-9 border border-gray-300 rounded-lg bg-blue-500 font-medium text-white gap-2 hover:bg-blue-700 hover:cursor-pointer'
                href='/users/add-user'
              >
                <FaPlus />
                Create User
              </Link>
            </div>
          }
          mainTitle='Users'
          subTitle='Manage all system users.'
        />
      </div>

      {/* filter*/}

      <div className='filters m-auto flex justify-between items-center gap-2 mt-15'>
        <div className='flex w-120 h-12'>
          <input
            className='border-t border-l border-b w-full h-full border-gray-300 bg-white rounded-l-lg p-4 outline-none focus:outline-none focus:ring-0 focus:border-gray-300'
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

        <div className='mb-5.5 w-120'>
          <label className='w-15 text-center  bg-white font-normal text-black text-lg'>
            Role
          </label>
          <DropdownMenu props={Roles} value={role} onRoleChange={setRole} />
        </div>

        <div className='mb-5.5 w-120'>
          <label className='w-15 text-center  bg-white font-normal text-black text-lg'>
            Status
          </label>
          <DropdownMenu
            props={Status}
            value={userStatus}
            onRoleChange={setUserStatus}
          />
        </div>

        <div className='flex gap-2'>
          <button
            className='flex justify-center items-center w-25 h-12  bg-gray-400 rounded-lg gap-2 font-bold hover:bg-gray-500 text-white hover:cursor-pointer'
            onClick={resetFilter}
          >
            Clear
          </button>
          <button
            className='flex justify-center items-center w-30 h-12  bg-blue-700 rounded-lg gap-2 font-bold hover:bg-blue-800 text-white hover:cursor-pointer'
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
        <div className='rounded-t-2xl border-t border-l border-r m-auto border-gray-200 overflow-y-auto'>
          <UsersTable users={Users} route={router} tableheaders={Headers} />
        </div>
      )}
    </div>
  )
}
