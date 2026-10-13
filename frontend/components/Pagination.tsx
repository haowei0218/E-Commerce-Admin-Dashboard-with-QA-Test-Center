import { Dispatch, SetStateAction } from "react"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination"
export default function UsePagination(
    { setPageFn, PAGE, totalPage }: { setPageFn: Dispatch<SetStateAction<number>>, PAGE: number, totalPage: number }
) {
    return (
        <div className='flex gap-2'>
            {Array.from({ length: totalPage }, (_, index) => index + 1)
                .map((pageNumber) => (
                    <PaginationItem key={pageNumber} className="list-none">
                        <PaginationLink
                            href="#"
                            isActive={PAGE === pageNumber}
                            onClick={(e) => {
                                e.preventDefault()
                                setPageFn(pageNumber)
                            }}
                            className={`
                                    transition-colors
                                    w-12 h-12
                                    ${PAGE === pageNumber
                                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                                    : "bg-white border border-gray-600 text-gray-600 hover:bg-gray-100"
                                }
                            `}
                        >
                            {pageNumber}
                        </PaginationLink>
                    </PaginationItem>
                ))}

        </div>
    )
}