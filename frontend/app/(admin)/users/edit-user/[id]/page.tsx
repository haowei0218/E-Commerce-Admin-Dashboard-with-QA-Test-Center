'use client'

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
import { loginUserProfile, RoleCode } from "@/type/admin-users/adminUser.type";
import { formatDate } from "@/lib/utils";
import Breadcrumbs from "../../components/breadcrumbs";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { SelectMenu } from "@/components/SelectMenu";
import { Roles, Status } from "@/lib/data";


export default function editUser() {
    const params = useParams<{ id: string }>()
    const userId = params.id ?? ""

    const [operatorUser, setOperatorUser] = useState<loginUserProfile | null>(null)
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [passwordDisable, setPasswordDisable] = useState<boolean>(true)
    const [confirmPasswordDisable, setConfirmPasswordDisable] = useState<boolean>(true)
    const [role, setRole] = useState<string>('All')
    const [userStatus, setUserStatus] = useState<string>('All')
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
    async function setRoleSubmit() {
        const result = await setAdminUserRole({ setAdminUserRoleId: userId, roleId: Number(role) as RoleCode })
        if (result) {
            toast.success('帳號角色設定成功')
        }
    }
    async function setStatusSubmit() {
        const result = await setAdminUserActive({ setAdminUserActiveId: userId, status: userStatus })
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

    const isProfileSubmitDisable = myProfileForm.formState.isLoading || myProfileForm.watch('email').length === 0 || myProfileForm.watch('name').length === 0
    const isChangePasswordSubmitDisable = userId !== operatorUser?.id && operatorUser?.role_id !== 1
    const isSetRoleSubmitDisable = roleForm.formState.isLoading || operatorUser?.role_id !== 1 || (operatorUser?.role_id === 1 && operatorUser?.id === userId)
    const isSetStatusSubmitDisable = statusForm.formState.isLoading || operatorUser?.role_id !== 1 || operatorUser.id === userId

    return (
        <div className='bg-gray-50 w-full h-full p-10 overflow-y-auto'>
            <div className="flex justify-between items-center">
                <div className="flex flex-col justify-center items-start gap-2">
                    <Breadcrumbs action="Edit" />
                    <h1 className='text-3xl font-bold'>
                        Edit Admin User
                    </h1>
                    <h3 className="text-lg font-medium text-gray-500">Update user information、role and status</h3>
                </div>
                <button className="flex w-50 h-15 justify-center items-center gap-2 hover:bg-gray-300 hover:cursor-pointer border-2 border-gray-300 rounded-lg bg-white" >
                    <FaLongArrowAltLeft className="font-normal text-black" />
                    <Link href='/users' className="text-lg font-normal text-black">Back to users</Link>
                </button>
            </div>

            <div className="flex w-full border border-gray-300 bg-white p-5 rounded-md mt-5">
                <div className="w-[25%] p-2 border-r-2 border-r-gray-200">
                    <button className="w-95 h-15 flex justify-start items-center text-lg font-bold text-gray-400 gap-4 hover:bg-blue-200 hover:text-blue-500 rounded-xl p-4">
                        <MdOutlineManageAccounts size={24} />
                        Basic Information
                    </button>
                    <button className="w-95 h-15 flex justify-start items-center text-lg font-bold text-gray-400 gap-4 hover:bg-blue-200 hover:text-blue-500 rounded-xl p-4">
                        <FaRegFileAlt size={24} />
                        Active Log
                    </button>
                </div>

                <div className="w-[75%] p-6 border-l-2 border-l-gray-200 flex flex-col gap-2">
                    <h1 className="text-2xl font-medium ">Basic Information</h1>
                    <p className="text-gray-500 text-lg">Update the user's basic profile information</p>

                    {/* 基本資料 */}
                    <form onSubmit={myProfileForm.handleSubmit(myProfileSubmit)} className="flex justify-between items-center">

                        <div className="flex justify-start items-center gap-8">
                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-black">
                                    Name
                                    <span className="text-sm text-red-600">*</span>
                                </label>

                                <input
                                    {...myProfileForm.register('name')}
                                    className="h-10 w-100 rounded-xl border-2 border-gray-500 px-3"
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
                                    className="h-10 w-100 rounded-xl border-2 border-gray-500 px-3"
                                    placeholder="Enter email"
                                />
                            </div>
                        </div>

                        <div className="w-full flex justify-end mt-5">
                            <button type="submit" className="w-30 h-9 border flex justify-center items-center border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 disabled:bg-gray-400" disabled={isProfileSubmitDisable}>{myProfileForm.formState.isLoading ? "變更中..." : "儲存變更"}</button>
                        </div>
                    </form>

                    {/* 變更密碼 */}
                    <form onSubmit={changePasswordForm.handleSubmit(changePasswordSubmit)} className="flex justify-between items-center">
                        <div className="flex justify-start items-center gap-8">
                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-black">
                                    Password
                                    <span className="text-sm text-red-600">*</span>
                                </label>

                                <div className="w-100 flex items-center">
                                    <input
                                        {...changePasswordForm.register('newPassword')}
                                        className="h-10 w-full border-l-2 border-t-2 border-b-2 rounded-l-xl border-gray-500 px-3"
                                        type={`${passwordDisable ? "password" : 'text'}`}
                                    />
                                    <button type="submit" className='h-10 w-[5%] border-t-2 border-r-2 border-b-2 rounded-r-xl  border-gray-500 pr-2 ' onClick={() => setPasswordDisable(!passwordDisable)}>
                                        <FaRegEyeSlash />
                                    </button>
                                </div>


                            </div>

                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-black">
                                    Comfirm Password
                                    <span className="text-sm text-red-600">*</span>
                                </label>
                                <div className="w-100 flex items-center">
                                    <input
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-10 w-full border-l-2 border-t-2 border-b-2 rounded-l-xl border-gray-500 px-3"
                                        type={`${confirmPasswordDisable ? "password" : 'text'}`}
                                        value={confirmPassword}
                                    />
                                    <button className='h-10 w-[5%] border-t-2 border-r-2 border-b-2 rounded-r-xl  border-gray-500 pr-2' onClick={() => setConfirmPasswordDisable(!confirmPasswordDisable)}>
                                        <FaRegEyeSlash />
                                    </button>
                                </div>
                                <p className={`text-sm text-red-500 ${isPasswordMisMatch.length === 0 ? "hidden" : ""}`}>
                                    {isPasswordMisMatch}
                                </p>

                            </div>
                        </div>
                        <div className="w-full flex justify-end mt-5">
                            <button type="submit" disabled={isChangePasswordSubmitDisable} className="w-30 h-9 border flex justify-center items-center border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 disabled:bg-gray-400">儲存變更</button>
                        </div>
                    </form>

                    {/* 角色設定 */}
                    <form onSubmit={roleForm.handleSubmit(setRoleSubmit)} className="flex justify-between items-center">
                        <SelectMenu
                            props={Roles}
                            value={role}
                            onSelectMenuValueChange={setRole}
                            label='帳戶角色'
                            
                        />
                        <div className="w-full flex justify-end">
                            <button disabled={isSetRoleSubmitDisable} type="submit" className="w-30 h-9 border flex justify-center items-center border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 disabled:bg-gray-400">{roleForm.formState.isLoading ? "變更中..." : "儲存變更"}</button>
                        </div>
                    </form>

                    {/* 帳號狀態設定 */}
                    <form onSubmit={statusForm.handleSubmit(setStatusSubmit)} className="flex justify-between items-center">
                        <SelectMenu
                            props={Status}
                            value={userStatus}
                            onSelectMenuValueChange={setUserStatus}
                            label='帳戶狀態'
                        />

                        <div className="w-full flex justify-end">
                            <button disabled={isSetStatusSubmitDisable} type="submit" className="w-30 h-9 border flex justify-center items-center border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 disabled:bg-gray-400">{statusForm.formState.isLoading ? "變更中..." : "儲存變更"}</button>
                        </div>
                    </form>


                </div>
            </div>




        </div>
    )
}