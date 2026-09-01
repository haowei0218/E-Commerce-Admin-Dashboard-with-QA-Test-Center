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
  onRoleChange: Dispatch<SetStateAction<any>>
}) {
  return (
    <select
      className='w-120 h-12 border border-gray-300 rounded-lg px-4 font-bold text-md bg-white appearance-none focus:outline-none focus:ring-0 focus:border-gray-300'
      onChange={(e) => onRoleChange(e.target.value)}
      value={value}
    >
      {props.map((item) => {
        return (
          <option key={item.value} value={item.value}>
            {item.optionName}
          </option>
        )
      })}
    </select>
  )
}
