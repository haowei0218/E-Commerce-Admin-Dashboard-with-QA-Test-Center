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
import { ExportButton } from '@/components/Button'
import { calculatePercentage } from '@/lib/utils'
import { FaUserFriends } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { StatisticsCard } from '@/components/StatisticsCard'

const cardList = [
    {
      icon: <FaUserFriends />,
      title: 'Total User',
      data: 256,
      percent: 100,
      subtitle: 'all users',
      backgroundColor: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <IoTimeOutline />,
      title: 'Active User',
      data: 198,
      percent: calculatePercentage(198, 256),
      subtitle: 'statistics active users',
      backgroundColor: 'bg-green-100 text-green-500',
    },
    {
      icon: <MdBlock />,
      title: 'InActive Users',
      data: 42,
      percent: calculatePercentage(42, 256),
      subtitle: 'statistics inactive users',
      backgroundColor: 'bg-orange-100 text-orange-500',
    },
    {
      icon: <GrUserManager />,
      title: 'Manage Users',
      data: 8,
      percent: calculatePercentage(8, 256),
      subtitle: 'Stock below 10',
      backgroundColor: 'bg-red-100 text-red-500',
    },
  ]

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
      <div className='m-auto py-5'>
        <PageTitle
          children={
            <div className='flex gap-2'>
              <ExportButton exportFn={()=>console.log('export function')}/>
              <CreateAdminUserDialog />
            </div>
          }
          mainTitle='Users'
          subTitle='Manage all system users.'
        />
      </div>

      <StatisticsCard cardList={cardList}/>

      {/* filter*/}

      <div className='m-auto flex justify-between items-end gap-2 mt-15 mb-10'>
        <SearchBox setKeyWords={setKeywords} keywords={keywords} onHandleSearch={() => handleAdminUserFilter()} />
        <SelectMenu
          props={Roles}
          value={role}
          onSelectMenuValueChange={setRole}
          label='users role'
        />
        <SelectMenu
          props={Status}
          value={userStatus}
          onSelectMenuValueChange={setUserStatus}
          label='users status'
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
