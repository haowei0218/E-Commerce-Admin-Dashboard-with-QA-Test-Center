export default function Table({
  headers,
  data,
}: {
  headers: string[]
  data: any[]
}) {
  return (
    <div className='overflow-hidden rounded-t-2xl border border-gray-300 w-[85%]'>
      <table className='w-full'>
        <thead className='bg-gray-200'>
          <tr className='flex justify-start gap-2 p-3'>
            {headers.map((header) => {
              return (
                <th className='text-left text-sm font-black font-stretch-condensed w-80 text-gray-600'>
                  <strong>{header}</strong>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody className='bg-white'>
          {data.map((item) => {
            return (
              <tr className='flex justify-start items-center gap-2 p-3'>
                {Object.values(item).map((obj: any) => {
                  return (
                    <th className='text-left text-sm font-black w-80 font-stretch-condensed'>
                      {obj}
                    </th>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
