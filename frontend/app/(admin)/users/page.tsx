'use client'
import { CgExport } from 'react-icons/cg'

import { SelectMenu } from '@/components/SelectMenu'
import { useEffect, useState } from 'react'
import { getAdminUserByProperties, getAdminUserStatistics, getUsers } from '@/lib/user.api'
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
import Pagination from '@/components/Pagination'
import { Loading } from './components/user-table-loading'



export default function Users() {
  const [page, setPage] = useState<number>(1)
  const PAGE_SIZE = 6

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
    setFilters({
      keyword: '',
      role: 'All',
      status: 'All',
    })
  }

  const adminUsersQuery = useQuery({
    queryKey: ['admin-users', filters, page],
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
        page: page,
        pageSize: PAGE_SIZE
      }),
  })

  const adminUserStatisticsQuery = useQuery({
    queryKey: ['admin-user-statistics'],
    queryFn: () => getAdminUserStatistics()
  })

  const statistics = adminUserStatisticsQuery.data?.GetAdminUserStatistics
  const cardList = [
    {
      icon: <FaUserFriends />,
      title: 'Total User',
      data: statistics?.total_users ?? 0,
      percent: 100,
      subtitle: 'Statistics of users in all states',
      backgroundColor: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <IoTimeOutline />,
      title: 'Active User',
      data: statistics?.active_users ?? 0,
      percent: calculatePercentage(statistics?.active_users ?? 0, statistics?.total_users ?? 0),
      subtitle: 'Statistics of all active users',
      backgroundColor: 'bg-green-100 text-green-500',
    },
    {
      icon: <MdBlock />,
      title: 'InActive Users',
      data: statistics?.inactive_users ?? 0,
      percent: calculatePercentage(statistics?.inactive_users ?? 0, statistics?.total_users ?? 0),
      subtitle: 'Statistics on all inactive users',
      backgroundColor: 'bg-orange-100 text-orange-500',
    },
    {
      icon: <GrUserManager />,
      title: 'Manage Users',
      data: statistics?.admin_users,
      percent: calculatePercentage(statistics?.admin_users ?? 0, statistics?.total_users ?? 0),
      subtitle: 'Statistics on users with management',
      backgroundColor: 'bg-red-100 text-red-500',
    },
  ]



  const adminUsers = adminUsersQuery.data?.GetAdminUserByProperties.getUsers ?? []
  const totalCount = adminUsersQuery.data?.GetAdminUserByProperties.totalCount ?? 0
  const totalPage = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className='bg-gray-50 p-5 '>
      <div className='m-auto py-5'>
        <PageTitle
          children={
            <div className='flex gap-2'>
              <ExportButton exportFn={() => exportCSV(adminUsers, ['id', 'name', 'email', 'code', 'status', 'create_at'], "users")} />
              <CreateAdminUserDialog />
            </div>
          }
          mainTitle='Users'
          subTitle='Manage all system users.'
        />
      </div>

      <StatisticsCard cardList={cardList} />

      {/* filter*/}
      <div className='bg-white rounded-md p-7 mt-5 '>
        <div className='m-auto flex justify-between items-end gap-2 mb-10'>
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

        {adminUsersQuery.isLoading && <div className='rounded-t-2xl border-t border-l border-r m-auto border-gray-200 '> <Loading headerList={usersTableHeaders} parameterNumber={usersTableHeaders.length} /></div>}

        {!adminUsersQuery.isLoading && <div className='rounded-t-2xl border-t border-l border-r m-auto border-gray-200 overflow-y-auto'><UsersTable users={adminUsers} route={router} tableheaders={usersTableHeaders} /></div>}



        <div className='flex justify-between items-center w-full mt-5'>
          <p className='text-lg text-gray-500 font-bold'>
            Showing {page * PAGE_SIZE - 5}-{page * PAGE_SIZE > totalCount ? totalCount : page * PAGE_SIZE} of {totalCount} Result
          </p>
          <Pagination setPageFn={setPage} PAGE={page} totalPage={totalPage} />
        </div>
      </div>


    </div>
  )
}
