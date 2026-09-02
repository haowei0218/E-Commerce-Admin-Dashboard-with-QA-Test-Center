import { adminUserProfile } from "@/type/admin-users/adminUser.type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { formatDate } from "@/lib/utils";
import { CiEdit } from "react-icons/ci";
type UsersTableRowProps = {
    user: adminUserProfile;
    route: AppRouterInstance;
};

type UserTableProps = {
    users: adminUserProfile[]
    route: AppRouterInstance
    tableheaders: HeaderProps[]
}

type HeaderProps = {
    headerName: string
    style: string
}

const statusStyle = {
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-red-100 text-red-700',
}



export function UsersTableRow(tableRowProps: UsersTableRowProps) {
    return (
        <tr
            className='flex gap-2 p-3 border-b border-gray-200'
            key={tableRowProps.user.id + tableRowProps.user.email}
        >
            <td className='text-left flex items-center text-md font-medium w-80 font-stretch-condensed'>
                {tableRowProps.user.id.slice(0, 28) + "..."}
            </td>
            <td className='text-left flex items-center text-md font-medium w-45 font-stretch-condensed '>
                {tableRowProps.user.name}
            </td>
            <td className='text-left flex items-center text-md font-medium w-60 font-stretch-condensed '>
                {tableRowProps.user.email}
            </td>
            <td className='text-left flex items-center text-md font-medium w-40 font-stretch-condensed '>
                {tableRowProps.user.code}
            </td>
            <td
                className="text-left flex items-center text-md font-medium w-30 font-stretch-condensed  "
            >
                <div className={`w-15 h-6 mt-1.5 flex justify-center items-center ${statusStyle[tableRowProps.user.status]} rounded-md`}>
                    <span >{tableRowProps.user.status}</span>
                </div>
            </td>
            <td className='flex items-center text-left text-md font-medium w-50 font-stretch-condensed '>
                {formatDate(tableRowProps.user.create_at)}
            </td>
            <td className='flex items-center text-left text-md font-medium w-50 font-stretch-condensed '>
                {formatDate(tableRowProps.user.update_at)}
            </td>
            <td className='flex items-center text-left text-md font-medium w-40 font-stretch-condensed '>
                {formatDate(tableRowProps.user.last_login_at)}
            </td>
            <td className='flex items-start gap-2 text-left text-md font-black font-stretch-condensed mb-2 '>
                <button
                    className='flex items-center justify-center text-white bg-amber-500 p-1 gap-2 rounded-md font-normal border border-gray-200 px-2.5 py-1.5  hover:bg-amber-600'
                    onClick={() => tableRowProps.route.push(`/users/edit-user/${tableRowProps.user.id}`)}
                >
                    Edit
                </button>
            </td>
        </tr>)
}

export function UsersTable(tableProps: UserTableProps) {
    return (
        <table className='w-full '>
            <thead className='bg-gray-200 rounded-t-2xl'>
                <tr className='flex justify-start gap-2 p-3 '>
                    {
                        tableProps.tableheaders.map((header: HeaderProps) => {
                            return (
                                <th key={header.headerName} className={`text-left text-sm font-black font-stretch-condensed text-gray-600 ${header.style}`}>
                                    <strong>{header.headerName}</strong>
                                </th>

                            )
                        })
                    }
                </tr>
            </thead>
            <tbody className='bg-white'>
                {tableProps.users?.map((user) => {
                    return (
                        <UsersTableRow key={user.id + user.name} user={user} route={tableProps.route} />
                    )
                })}
            </tbody>
        </table>
    )
}