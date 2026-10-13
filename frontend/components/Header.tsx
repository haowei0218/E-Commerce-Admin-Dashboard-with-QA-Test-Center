'use client'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { IoMdArrowDropright } from "react-icons/io";
export function Header() {
  const pathname = usePathname()
  const pathnameList = pathname.split('/').filter(Boolean)

  const routes = [{ route: '/', name: 'home' }]
  let prev = "/"
  for (let i = 0; i < pathnameList.length; i++) {
    prev = prev + "/" + pathnameList[i]
    routes.push({ route: prev, name: pathnameList[i] })
  }
  const routesLength = routes.length

  return (
    <div className='title w-full min-h-15 bg-white flex justify-between items-center text-white border-b border-gray-200 px-5'>
      <Breadcrumb>
        <BreadcrumbList className="text-lg font-medium flex items-center">
          {
            routes.map((breadcrumb, index) => {
              if (index === routesLength - 1) {
                return (
                  <BreadcrumbItem key={breadcrumb.name}>
                    <BreadcrumbLink
                      href={breadcrumb.route}
                      className="text-gray-500 font-medium"
                    >
                      {breadcrumb.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )
              } else {
                return (
                  <div key={breadcrumb.name} className='flex items-center'>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/${breadcrumb.route}`}
                        className="text-gray-500 font-medium"
                      >
                        {breadcrumb.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="[&>svg]:size-6 text-gray-600">
                      <IoMdArrowDropright />
                    </BreadcrumbSeparator>
                  </div>

                )
              }
            })
          }
        </BreadcrumbList>
      </Breadcrumb>
      <div className='flex items-center'>
        <IoMdNotificationsOutline className='text-black text-3xl' />
        <div className='flex w-60 h-full gap-3 items-center justify-center'>
          <IoPersonCircleOutline className='text-black text-5xl' />
          <div className='flex flex-col justify-center items-start h-full'>
            <h1 className='text-gray-800 font-base text-base'>Admin</h1>
            <span className='text-gray-400 text-sm'>user name</span>
          </div>
          <MdKeyboardArrowDown className='text-gray-800 text-2xl ml-4' />
        </div>
      </div>

    </div>
  )
}
