import { calculatePercentage } from "@/lib/utils"
import { ReactNode } from "react"
import { IconType } from "react-icons/lib"



type card = {
  icon: ReactNode
  title: string
  data: number | undefined
  percent: number | undefined
  subtitle: string
  backgroundColor: string
}



export function StatisticsCard({ cardList }: { cardList: card[] }) {

  return (

    <div className='flex justify-between items-center'>
      {cardList.map((card, index) => {
        return (
          <div
            key={card.title}
            className='flex w-[24%] gap-4 itmes-start p-5 bg-white rounded-lg shadow shadow-gray-300'
          >
            <div
              className={`flex items-center justify-center rounded-full w-15 h-15 ${card.backgroundColor} text-3xl`}
            >
              {card.icon}
            </div>

            <div className='w-[80%]'>
              <h2 className='text-[16px] text-gray-500 font-bold'>
                {card.title}
              </h2>
              <div className='flex justify-between items-end w-full'>
                <p className='text-3xl font-bold'>{card.data}</p>
                <p
                  className={`text-sm ${card.backgroundColor.includes('red')
                    ? 'text-red-500 '
                    : 'text-green-500'
                    } font-bold`}
                >
                  {
                    card.percent
                  }%
                </p>
              </div>

              <p className='text-sm font-bold text-slate-500'>
                {card.subtitle}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}