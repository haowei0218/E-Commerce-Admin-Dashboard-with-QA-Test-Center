import { SetStateAction, Dispatch } from 'react'
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
    <select
      className='w-50 h-9 border border-gray-300 rounded-lg px-4 font-bold text-lg'
      onChange={(e) => onRoleChange(e.target.value)}
      value={value}
    >
      {props.map((item) => {
        return <option value={item.value}>{item.optionName}</option>
      })}
    </select>
  )
}
