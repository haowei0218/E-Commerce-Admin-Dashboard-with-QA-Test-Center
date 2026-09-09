import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbLink,
    BreadcrumbItem,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { IoMdArrowDropright } from "react-icons/io";
export default function Breadcrumbs({ action }: { action: string }) {
    return (
        <Breadcrumb>
            <BreadcrumbList className="text-lg font-medium">
                <BreadcrumbItem>
                    <BreadcrumbLink
                        href="/users"
                        className="text-gray-500 font-medium"
                    >
                        users
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="[&>svg]:size-6">
                    <IoMdArrowDropright />
                </BreadcrumbSeparator>
                <BreadcrumbItem>{action}</BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}