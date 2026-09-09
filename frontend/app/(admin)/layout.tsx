import NavigationBar from "@/components/ui/NavigationBar"
import { Header } from "@/components/Header"
import { LuChurch } from 'react-icons/lu'
import { MdDashboard, MdAdminPanelSettings } from 'react-icons/md'
import { FaWallet } from 'react-icons/fa6'
import { FaUser, FaLock } from 'react-icons/fa'
import { AiFillFile } from 'react-icons/ai'
import { IoMdSettings } from 'react-icons/io'
import { HiDocumentReport } from 'react-icons/hi'
import { TfiLayoutMediaCenterAlt } from 'react-icons/tfi'
import { IoLogOutOutline } from 'react-icons/io5'
const sidebarIconStyle = 'text-2xl'
export const navigationBarList = [
  {
    sidebarName: 'Dashboard',
    sidebarIcon: <MdDashboard className={sidebarIconStyle} />,
    route: '/dashboard',
  },
  {
    sidebarName: 'Orders',
    sidebarIcon: <FaWallet className={sidebarIconStyle} />,
    route: '/orders',
  },
  {
    sidebarName: 'Users',
    sidebarIcon: <FaUser className={sidebarIconStyle} />,
    route: '/users',
  },
  {
    sidebarName: 'Products',
    sidebarIcon: <AiFillFile className={sidebarIconStyle} />,
    route: '/products',
  },
  {
    sidebarName: 'Test Center',
    sidebarIcon: <TfiLayoutMediaCenterAlt className={sidebarIconStyle} />,
    route: '/test-center',
  },
  {
    sidebarName: 'Report',
    sidebarIcon: <HiDocumentReport className={sidebarIconStyle} />,
    route: '/report',
  },
  {
    sidebarName: 'Roles & Permissions',
    sidebarIcon: <FaLock className={sidebarIconStyle} />,
    route: '/roles-permissions',
  },
  {
    sidebarName: 'Settings',
    sidebarIcon: <IoMdSettings className={sidebarIconStyle} />,
    route: '/settings',
  },
  {
    sidebarName: 'Logout',
    sidebarIcon: <IoLogOutOutline className={sidebarIconStyle} />,
    route: '/login',
  },
]

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex h-dvh overflow-hidden">
            <NavigationBar navigationList={navigationBarList} />
            <div className="main w-full flex flex-col h-full">
                <Header />
                {children}
            </div>
        </div>
    )
}