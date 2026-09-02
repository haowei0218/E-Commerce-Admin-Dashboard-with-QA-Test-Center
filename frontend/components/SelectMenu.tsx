import { SetStateAction, Dispatch } from 'react'
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

export function SelectMenu({
  props,
  value,
  onSelectMenuValueChange,
  label
}: {
  props: dropdownMenuProps[]
  value: string
  onSelectMenuValueChange: Dispatch<SetStateAction<any>>
  label: string
}) {
  const items = props.map((item) => ({
    value: item.value,
    label: item.optionName,
  }))
  return (
    <div className='grid gap-2'>
      <label className='w-20 text-center   font-normal text-black text-lg'>
        {label}
      </label>
      <Select
        onValueChange={(nextValue) => onSelectMenuValueChange(nextValue)}
        value={value}
        items={items}

      >
        <SelectTrigger className='w-125 !h-12 border border-gray-300 rounded-lg px-4 font-bold text-md bg-white appearance-none focus:outline-none focus:ring-0 focus:border-gray-300'>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>

        <SelectContent className='bg-white' side="bottom" align="start">
          {items.map((item) => {
            return (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            )
          })}
        </SelectContent>

      </Select>
    </div>
  )
}
