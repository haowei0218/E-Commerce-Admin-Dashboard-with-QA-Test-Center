'use client'
import NavigationBar from "@/components/ui/NavigationBar"
import { Header } from "@/components/Header"
import { navigationBarList } from "@/app/dashboard/page"
import { FaBullseye, FaLongArrowAltLeft } from "react-icons/fa";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { RiArrowDropDownLine } from 'react-icons/ri'
import { useEffect, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { changePassword, setAdminUserActive, setAdminUserRole, updateMyProfile } from "@/lib/user.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { getAdminUserById } from "@/lib/user.api";
import { loginUserProfile } from "@/type/adminUser.type";
import { RoleCode } from "@/type/adminUser.type";


export default function editUser() {
    const params = useParams<{ id: string }>()
    const userId = params.id ?? ""

    const [operatorUser, setOperatorUser] = useState<loginUserProfile | null>(null)
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [passwordDisable, setPasswordDisable] = useState<boolean>(true)
    const [confirmPasswordDisable, setConfirmPasswordDisable] = useState<boolean>(true)
    const [roleMap, setRoleMap] = useState<boolean[]>([])
    const router = useRouter()
    const userInfo = z.object({
        name: z.string().min(1).max(30),
        roleId: z.number(),
        email: z.email(),
        passwordHash: z.string().min(1).max(30),
        status: z.string()
    })

    type userInformation = z.infer<typeof userInfo>
    type myProfile = Omit<userInformation, 'roleId' | "passwordHash" | "status"> & { updateMyProfileId: string }
    type changePassword = { changePasswordId: string, newPassword: string }
    type setStatus = Omit<userInformation, 'roleId' | "name" | "passwordHash" | "email">
    type setRoleId = Omit<userInformation, 'status' | "name" | "passwordHash" | "email"> & { setAdminUserRoleId: string }

    const myProfileForm = useForm<myProfile>({
        defaultValues: {
            name: "",
            email: ""
        }
    })

    const changePasswordForm = useForm<changePassword>({
        defaultValues: {
            newPassword: ""
        }
    })

    const statusForm = useForm<setStatus>({
        defaultValues: {
            status: ""
        }
    })

    const roleForm = useForm<setRoleId>({
        defaultValues: {
            roleId: 0
        }
    })


    /**onSubmit function*/
    async function myProfileSubmit(data: myProfile) {
        const result = await updateMyProfile({ ...data, updateMyProfileId: userId })
        if (result) {
            toast.success("更新個人資料成功")
        }
    }
    async function changePasswordSubmit(data: changePassword) {
        const result = await changePassword({ ...data, changePasswordId: userId })
        if (result) {
            toast.success('密碼變更成功')
        }
    }
    async function setRoleSubmit(data: setRoleId) {
        const result = await setAdminUserRole({ setAdminUserRoleId: userId, roleId: Number(data.roleId) as RoleCode })
        if (result) {
            toast.success('帳號角色設定成功')
        }
    }
    async function setStatusSubmit(data: setStatus) {
        const result = await setAdminUserActive({ setAdminUserActiveId: userId, status: (data.status) })
        if (result) {
            toast.success('帳號狀態設定成功')
        }
    }




    useEffect(() => {
        if (!userId) return
        const storedUser = localStorage.getItem('user')
        const operatorUser = storedUser ? JSON.parse(storedUser) : null
        setOperatorUser(operatorUser)

        const operatorManagePermission = operatorUser?.manage_level
        if (operatorManagePermission === undefined) {
            return
        }
        const roleDisable: boolean[] = ["20", "40", "50", "60", "80", "100"].map((item: string) => operatorManagePermission < Number(item))
        setRoleMap(roleDisable)
        async function GetAdminUserById() {
            try {
                const response = await getAdminUserById({ userId: userId })
                const user = response.GetAdminUserById.getUserById

                console.log('user : ', user)

                myProfileForm.reset({ name: user?.name ?? "", email: user?.email ?? "" })
                roleForm.reset({ roleId: Number(user?.role_id ?? 0) })
                statusForm.reset({ status: user?.status ?? "" })

            } catch (error) {
                console.log(error)
            }
        }
        GetAdminUserById()
    }, [])


    const password = changePasswordForm.watch('newPassword')
    const isPasswordMisMatch = confirmPassword.length !== 0 && password !== confirmPassword ? "密碼不一致 請重新輸入" : ""

    const isProfileSubmitDisable = myProfileForm.formState.isLoading
    const isChangePasswordSubmitDisable = userId !== operatorUser?.id && operatorUser?.role_id !== 1
    const isSetRoleSubmitDisable = roleForm.formState.isLoading || operatorUser?.role_id !== 1 || (operatorUser?.role_id === 1 && operatorUser?.id === userId)
    const isSetStatusSubmitDisable = statusForm.formState.isLoading || operatorUser?.role_id !== 1 || operatorUser.id === userId

    return (
        <div className='w-full h-full flex '>
            <NavigationBar navigaionbarList={navigationBarList} />
            <div className='min-w-0 flex-1 flex flex-col'>
                <Header />
                <div className='bg-gray-50 w-full h-full p-5 overflow-y-auto'>
                    <div className="flex items-start gap-10">
                        <button className="flex items-center gap-2 hover:text-blue-900 hover:cursor-pointer">
                            <FaLongArrowAltLeft className="font-black text-blue-500" />
                            <Link href='/users' className="text-lg font-black text-blue-500">back</Link>
                        </button>
                        <PageTitle mainTitle="Edit User" subTitle="Edit a system user and assign their access." />
                    </div>

                    {/* 基本資料 */}
                    <form onSubmit={myProfileForm.handleSubmit(myProfileSubmit)} className=" w-full max-w-6xl mt-10 ml-20 border border-gray-300 rounded-2xl bg-white p-10 ">
                        <h1 className="text-2xl font-black mb-10">基本資料</h1>

                        <div className="grid gap-8 md:grid-cols-2 mb-5">
                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-black">
                                    Name
                                    <span className="text-sm text-red-600">*</span>
                                </label>

                                <input
                                    {...myProfileForm.register('name')}
                                    className="h-10 w-full rounded-xl border-2 border-gray-200 px-3"
                                    placeholder="Enter full name"

                                />
                            </div>

                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-black">
                                    Email
                                    <span className="text-sm text-red-600">*</span>
                                </label>

                                <input
                                    {...myProfileForm.register('email')}
                                    className="h-10 w-full rounded-xl border-2 border-gray-200 px-3"
                                    placeholder="Enter email"
                                />
                            </div>
                        </div>

                        <div className="w-full flex justify-end">
                            <button type="submit" className="w-30 h-9 border flex justify-center items-center border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 disabled:bg-gray-400" disabled={isProfileSubmitDisable}>{myProfileForm.formState.isLoading ? "變更中..." : "儲存變更"}</button>
                        </div>
                    </form>

                    {/* 變更密碼 */}
                    <form onSubmit={changePasswordForm.handleSubmit(changePasswordSubmit)} className=" w-full max-w-6xl mt-10 ml-20 border border-gray-300 rounded-2xl bg-white p-10 ">
                        <h1 className="text-2xl font-black mb-10">變更密碼</h1>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-15">
                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-black">
                                    Password
                                    <span className="text-sm text-red-600">*</span>
                                </label>

                                <div className="w-full flex items-center">
                                    <input
                                        {...changePasswordForm.register('newPassword')}
                                        className="h-10 w-[95%] border-l-2 border-t-2 border-b-2 rounded-l-xl border-gray-200 px-3"
                                        type={`${passwordDisable ? "password" : 'text'}`}
                                    />
                                    <button type="submit" className='h-10 w-[5%] border-t-2 border-r-2 border-b-2 rounded-r-xl  border-gray-200 pr-2 ' onClick={() => setPasswordDisable(!passwordDisable)}>
                                        <FaRegEyeSlash />
                                    </button>
                                </div>


                            </div>

                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-black">
                                    Comfirm Password
                                    <span className="text-sm text-red-600">*</span>
                                </label>
                                <div className="w-full flex items-center">
                                    <input
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-10 w-[95%] border-l-2 border-t-2 border-b-2 rounded-l-xl border-gray-200 px-3"
                                        type={`${confirmPasswordDisable ? "password" : 'text'}`}
                                        value={confirmPassword}
                                    />
                                    <button className='h-10 w-[5%] border-t-2 border-r-2 border-b-2 rounded-r-xl  border-gray-200 pr-2' onClick={() => setConfirmPasswordDisable(!confirmPasswordDisable)}>
                                        <FaRegEyeSlash />
                                    </button>
                                </div>

                                <p className="text-sm text-red-500">
                                    {isPasswordMisMatch}
                                </p>

                            </div>
                        </div>
                        <div className="w-full flex justify-end">
                            <button type="submit" disabled={isChangePasswordSubmitDisable} className="w-30 h-9 border flex justify-center items-center border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 disabled:bg-gray-400">儲存變更</button>
                        </div>
                    </form>

                    {/* 角色設定 */}
                    <form onSubmit={roleForm.handleSubmit(setRoleSubmit)} className=" w-full max-w-6xl mt-10 ml-20 border border-gray-300 rounded-2xl bg-white p-10 ">
                        <h1 className="text-2xl font-black mb-10">角色設定</h1>
                        <div className="grid grid-cols-1 gap-8 md:grid-cwols-2 mb-5">
                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-black">
                                    Role
                                    <span className="text-sm text-red-600">*</span>
                                </label>

                                <div className="relative w-full">
                                    <select {...roleForm.register('roleId')} className="h-10 w-full rounded-xl border-2 appearance-none border-gray-200 px-3 text-gray-500 text-md font-black">
                                        <option value={0} className="">Select role</option>
                                        <option value={2} >營運主管</option>
                                        <option value={3} >客服／營運人員</option>
                                        <option value={4} >唯讀帳號</option>
                                        <option value={5} >測試人員</option>
                                        <option value={6} >工程師</option>
                                    </select>
                                    <RiArrowDropDownLine
                                        className='
                                      pointer-events-none
                                      absolute right-3 top-1/2
                                      -translate-y-1/2
                                      text-2xl
                                    '
                                    ></RiArrowDropDownLine>
                                </div>

                            </div>
                        </div>
                        <div className="w-full flex justify-end">
                            <button disabled={isSetRoleSubmitDisable} type="submit" className="w-30 h-9 border flex justify-center items-center border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 disabled:bg-gray-400">{roleForm.formState.isLoading ? "變更中..." : "儲存變更"}</button>
                        </div>
                    </form>

                    {/* 帳號狀態設定 */}
                    <form onSubmit={statusForm.handleSubmit(setStatusSubmit)} className=" w-full max-w-6xl mt-10 ml-20 border border-gray-300 rounded-2xl bg-white p-10 ">
                        <h1 className="text-2xl font-black mb-10">狀態設定</h1>
                        <div className="flex flex-col items-start gap-2 mb-5">
                            <label className="flex gap-1 text-lg font-black">
                                Statue
                                <span className="text-sm text-red-600">*</span>
                            </label>
                            <div className="relative w-full">
                                <select {...statusForm.register('status')} className="h-10 w-full rounded-xl border-2 appearance-none border-gray-200 px-3 text-gray-500 text-md font-black">
                                    <option value="">Select status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>

                                </select>
                                <RiArrowDropDownLine
                                    className='
                                      pointer-events-none
                                      absolute right-3 top-1/2
                                      -translate-y-1/2
                                      text-2xl
                                    '
                                ></RiArrowDropDownLine>
                            </div>
                        </div>

                        <div className="w-full flex justify-end">
                            <button disabled={isSetStatusSubmitDisable} type="submit" className="w-30 h-9 border flex justify-center items-center border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 disabled:bg-gray-400">{statusForm.formState.isLoading ? "變更中..." : "儲存變更"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}