'use client'
import { CgExport } from 'react-icons/cg'
import { FaPlus } from 'react-icons/fa'
import { CiSearch } from 'react-icons/ci'

import { SelectMenu } from '@/components/SelectMenu'
import { useEffect, useState } from 'react'
import { adminUserProfile } from '@/type/admin-users/adminUser.type'
import { getAdminUserByProperties, getUsers } from '@/lib/user.api'
import { Ring } from '@/components/ring'
import { CiFilter } from 'react-icons/ci'
import { useRouter } from 'next/navigation'
import PageTitle from '@/components/ui/PageTitle'
import Link from 'next/link'
import { UsersTable } from './components/users-table'
import { exportCSV } from '@/lib/utils'
import { ordersTableHeaders, Roles, Status, usersTableHeaders } from '@/lib/data'
import { FilterButton, SearchBox } from '@/components/Filter'


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

      <div className='m-auto flex justify-between items-end gap-2 mt-15 mb-10'>
        <SearchBox setKeyWords={setKeywords} keywords={keywords} onHandleSearch={() => handleAdminUserFilter('Search')} />
        <SelectMenu
          props={Roles}
          value={role}
          onSelectMenuValueChange={setRole}
          label='帳戶角色'
        />
        <SelectMenu
          props={Status}
          value={userStatus}
          onSelectMenuValueChange={setUserStatus}
          label='帳戶狀態'
        />
        <FilterButton clearFilterFn={resetFilter} FilterFn={() => handleAdminUserFilter('Filter')} />
      </div>
      {/* table*/}
      {!Users && <Ring className='w-10 h-10 m-auto' />}
      {Users && (
        <div className='rounded-t-2xl border-t border-l border-r m-auto border-gray-200 overflow-y-auto'>
          <UsersTable users={Users} route={router} tableheaders={usersTableHeaders} />
        </div>
      )}

      
    </div>
  )
}
