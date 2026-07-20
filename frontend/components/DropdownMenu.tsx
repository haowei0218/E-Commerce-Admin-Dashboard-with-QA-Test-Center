import { SetStateAction, Dispatch } from 'react'
import { RiArrowDropDownLine } from 'react-icons/ri'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
type dropdownMenuProps = {
  value: string | number
  optionName: string
}

export function DropdownMenu({
  props,
  value,
  onRoleChange,
}: {
  props: dropdownMenuProps[]
  value: string
  onRoleChange: Dispatch<SetStateAction<string>>
}) {
  return (
    <div className='relative w-50'>
      <select
        className='w-50 h-9 border border-gray-300 rounded-lg px-4 font-bold text-md appearance-none'
        onChange={(e) => onRoleChange(e.target.value)}
        value={value}
      >
        {props.map((item) => {
          return <option value={item.value}>{item.optionName}</option>
        })}
      </select>
      <RiArrowDropDownLine
        className='
      pointer-events-none
      absolute right-3 top-1/2
      -translate-y-1/2
      text-xl
    '
      ></RiArrowDropDownLine>
    </div>
  )
}
