import NavigationBar from "@/components/ui/NavigationBar"
import { Header } from "@/components/Header"
import { navigationBarList } from "./dashboard/page"
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex h-dvh overflow-hidden">
            <NavigationBar navigationList={navigationBarList} />
            <div className="main w-full flex flex-col h-full">
                <Header />
                {children}
            </div>
        </div>
    )
}