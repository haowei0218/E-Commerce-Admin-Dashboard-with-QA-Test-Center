type DashboardCard = {
  title: string
  value: string
  icon: React.ReactNode
  style: string
}
export default function DashboardCards({ cards }: { cards: DashboardCard[] }) {
  return (
    <>
      {cards.map((card) => {
        return (
          <div
            key={card.title}
            className='flex justify-center p-4 items-center gap-4 w-[20%] bg-white h-full border border-gray-200 rounded-md shadow-sm shadow-gray-200'
          >
            <div
              className={`w-10 h-11 ${card.style} p-2 flex justify-center items-center rounded-md`}
            >
              {card.icon}
            </div>

            <div className='flex flex-col w-[70%] justify-start items-start text-start'>
              <h2 className='text-gray-400 text-sm font-black'>{card.title}</h2>
              <span className='text-gray-900 font-bold text-2xl'>
                {card.value}
              </span>
            </div>
          </div>
        )
      })}
    </>
  )
}
