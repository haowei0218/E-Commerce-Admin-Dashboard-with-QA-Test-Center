export default function PageTitle({ children, mainTitle, subTitle }: { children?: React.ReactNode, mainTitle: string, subTitle: string }) {
    return (
        <div className='flex justify-between items-center gap-2 w-[85%]'>

            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl'>
                    <strong>{mainTitle}</strong>
                </h1>
                <span className='text-gray-400 text-sm font-bold'>
                    {subTitle}
                </span>
            </div>
            {children}
        </div>
    )
}