import { SelectMenu } from "./SelectMenu"
import { CiSearch, CiFilter } from "react-icons/ci"
import { SetStateAction, Dispatch } from 'react'
export type selectMenu = {
    label: string
    props: dropdownMenuProps[]
    value: string
    onValueChange: Dispatch<SetStateAction<any>>
}

type dropdownMenuProps = {
    value: string | number
    optionName: string
}


export function FilterButton({ clearFilterFn, FilterFn }: {
    clearFilterFn: () => void
    FilterFn: () => void
}) {
    return (
        <div className='flex gap-2'>
            <button
                className='flex justify-center items-center w-25 h-12  bg-gray-400 rounded-lg gap-2 font-bold hover:bg-gray-500 text-white hover:cursor-pointer'
                onClick={clearFilterFn}
            >
                Clear
            </button>
            <button
                className='flex justify-center items-center w-30 h-12  bg-blue-700 rounded-lg gap-2 font-bold hover:bg-blue-800 text-white hover:cursor-pointer'
                onClick={FilterFn}
            >
                <CiFilter />
                Filter
            </button>
        </div>
    )
}

export function SearchBox({
    setKeyWords,
    keywords,
    onHandleSearch
}: {
    setKeyWords: Dispatch<SetStateAction<string>>
    keywords: string
    onHandleSearch: () => void

}) {
    return (
        <div className="grid gap-2">
            <label className="w-20 font-normal text-black text-lg">
                搜尋
            </label>
            <div className='flex w-120'>
                <input
                    className='border-t border-l border-b w-full h-12 border-gray-300 bg-white rounded-l-lg p-4 outline-none focus:outline-none focus:ring-0 focus:border-gray-300'
                    placeholder='search username or email'
                    onChange={(e) => setKeyWords(e.target.value)}
                    value={keywords}
                />
                <button
                    className='border-t border-r border-b bg-white border-gray-300 rounded-r-lg pr-2'
                    onClick={onHandleSearch}
                >
                    <CiSearch className='text-2xl' />
                </button>
            </div>
        </div>
    )
}