import type { adminUserProfile } from "@/type/admin-users/adminUser.type";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { formatDate } from "@/lib/utils";
import { TbEyeSearch } from "react-icons/tb";

type UsersTableRowProps = {
  user: adminUserProfile;
  route: AppRouterInstance;
};

type HeaderProps = {
  headerName: string;
  style: string;
};

type UserTableProps = {
  users: adminUserProfile[];
  route: AppRouterInstance;
  tableheaders: HeaderProps[];
};

const statusStyle: Record<string, string> = {
  Active: "bg-green-300 text-green-700",
  Inactive: "bg-red-300 text-red-700",
};

const cellClass = "px-4 py-3 align-middle";
const dateClass = "whitespace-nowrap text-sm text-gray-600";

export function UsersTableRow({ user, route }: UsersTableRowProps) {
  return (
    <tr className="border-b border-gray-200 transition-colors hover:bg-gray-50">
      <td className={cellClass}>
        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
        <p className="max-w-[200px] truncate text-xs text-gray-500" title={user.id}>
          {user.id}
        </p>
      </td>

      <td className={cellClass}>
        <span className="whitespace-nowrap text-sm text-gray-600">
          {user.email}
        </span>
      </td>

      <td className={cellClass}>
        <span className="inline-block whitespace-nowrap rounded-md bg-gray-200 px-2 py-1 text-sm text-gray-600">
          {user.code}
        </span>
      </td>

      <td className={cellClass}>
        <span
          className={`inline-flex min-w-[90px] items-center justify-center rounded-md px-3 py-1 text-sm font-medium ${
            statusStyle[user.status] ?? "bg-gray-200 text-gray-600"
          }`}
        >
          {user.status}
        </span>
      </td>

      <td className={cellClass}>
        <span className={dateClass}>{formatDate(user.create_at)}</span>
      </td>

      <td className={cellClass}>
        <span className={dateClass}>{formatDate(user.update_at)}</span>
      </td>

      <td className={cellClass}>
        <span className={dateClass}>{formatDate(user.last_login_at)}</span>
      </td>

      <td className={cellClass}>
        <button
          type="button"
          className="flex h-10 w-full min-w-20 items-center justify-center gap-2 rounded-md border border-blue-500 text-lg font-bold text-blue-500 hover:cursor-pointer hover:bg-blue-500 hover:text-white"
          onClick={() => route.push(`/users/edit-user/${user.id}`)}
        >
          <TbEyeSearch aria-hidden="true" />
          View
        </button>
      </td>
    </tr>
  );
}

export function UsersTable({ users, route, tableheaders }: UserTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[1150px] table-auto">
        <thead className="bg-gray-50">
          <tr>
            {tableheaders.map(({ headerName }) => (
              <th
                key={headerName}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left text-sm font-bold text-gray-600"
              >
                {headerName}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {users?.map((user) => (
            <UsersTableRow key={user.id} user={user} route={route} />
          ))}
        </tbody>
      </table>
    </div>
  );
}