'use client'
import { CgExport } from 'react-icons/cg'

import { SelectMenu } from '@/components/SelectMenu'
import { useEffect, useState } from 'react'
import { getAdminUserByProperties, getUsers } from '@/lib/user.api'
import { Ring } from '@/components/ring'
import { useRouter } from 'next/navigation'
import PageTitle from '@/components/ui/PageTitle'
import { UsersTable } from './components/users-table'
import { exportCSV } from '@/lib/utils'
import { ordersTableHeaders, Roles, Status, usersTableHeaders } from '@/lib/data'
import { FilterButton, SearchBox } from '@/components/Filter'
import { useQuery } from '@tanstack/react-query'
import CreateAdminUserDialog from './components/create-admin-user-dialog'


export default function Users() {
  const [role, setRole] = useState<string>('All')
  const [userStatus, setUserStatus] = useState<string>('All')
  const [keywords, setKeywords] = useState<string>('')
  const [filters, setFilters] = useState({
    keyword: '',
    role: 'All',
    status: 'All',
  })

  const router = useRouter()
  async function handleAdminUserFilter() {
    setFilters({
      keyword: keywords,
      role,
      status: userStatus,
    })
  }
  async function resetFilter() {
    setRole('All')
    setUserStatus('All')
    setKeywords('')
  }

  const adminUsersQuery = useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () =>
      getAdminUserByProperties({
        keyword: filters.keyword.trim() || null,
        roleId:
          filters.role === 'All'
            ? null
            : Number(filters.role),

        status:
          filters.status === 'All'
            ? null
            : filters.status,
      }),
  })

  const adminUsers = adminUsersQuery.data?.GetAdminUserByProperties.getUsers ?? []


  return (
    <div className='bg-gray-50 w-full h-full p-5 '>
      <div className='border border-gray-200 rounded-lg p-5 bg-white m-auto'>
        <PageTitle
          children={
            <div className='flex gap-2'>
              <button className='flex justify-center items-center w-25 h-9 border border-green-500 rounded-lg bg-white gap-2 font-medium text-green-500 hover:bg-green-700 hover:text-white hover:cursor-pointer' onClick={() => exportCSV(adminUsers, ["id", "name", "email", "status", 'code', 'create_at'], "users")}>
                <CgExport />
                Export
              </button>
              <CreateAdminUserDialog />
            </div>
          }
          mainTitle='Users'
          subTitle='Manage all system users.'
        />
      </div>

      {/* filter*/}

      <div className='m-auto flex justify-between items-end gap-2 mt-15 mb-10'>
        <SearchBox setKeyWords={setKeywords} keywords={keywords} onHandleSearch={() => handleAdminUserFilter()} />
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
        <FilterButton clearFilterFn={resetFilter} FilterFn={() => handleAdminUserFilter()} />
      </div>
      {/* table*/}
      {!adminUsers && <Ring className='w-10 h-10 m-auto' />}
      {adminUsers && (
        <div className='rounded-t-2xl border-t border-l border-r m-auto border-gray-200 overflow-y-auto'>
          <UsersTable users={adminUsers} route={router} tableheaders={usersTableHeaders} />
        </div>
      )}
    </div>
  )
}
