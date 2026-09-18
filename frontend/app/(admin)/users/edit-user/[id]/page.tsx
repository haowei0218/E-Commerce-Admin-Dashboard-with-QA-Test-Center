'use client'

import { FaBullseye, FaLongArrowAltLeft } from "react-icons/fa";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";
import { promise, z } from 'zod'
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
import { useQuery } from "@tanstack/react-query";
import { FaRegSave } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";



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

    const adminUserByIdQuery = useQuery({
        queryKey: ['admin-user-by-id'],
        queryFn: () => getAdminUserById({ userId: userId }),
        enabled: Boolean(userId)
    })
    const adminUser = adminUserByIdQuery.data?.GetAdminUserById.getUserById

    useEffect(() => {
        if (adminUser) {
            setUserStatus(adminUser.status)
            setRole(String(adminUser.role_id))
        }
    }, [adminUser])

    type userInformation = z.infer<typeof userInfo>
    type myProfile = Omit<userInformation, 'roleId' | "passwordHash" | "status"> & { updateMyProfileId: string }
    type changePassword = { changePasswordId: string, newPassword: string }
    type setStatus = Omit<userInformation, 'roleId' | "name" | "passwordHash" | "email">
    type setRoleId = Omit<userInformation, 'status' | "name" | "passwordHash" | "email"> & { setAdminUserRoleId: string }

    const myProfileForm = useForm<myProfile>({
        defaultValues: {
            name: adminUser?.name ?? "",
            email: adminUser?.email ?? ""
        }
    })

    const changePasswordForm = useForm<changePassword>({
        defaultValues: {
            newPassword: ""
        }
    })

    const statusForm = useForm<setStatus>({
        defaultValues: {
            status: adminUser?.status ?? ""
        }
    })

    const roleForm = useForm<setRoleId>({
        defaultValues: {
            roleId: Number(adminUser?.role_id) ?? 0
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

    async function onSubmit() {
        try {
            const task = [];

            if (myProfileForm.formState.dirtyFields.email || myProfileForm.formState.dirtyFields.name) {
                task.push(myProfileSubmit(myProfileForm.getValues()))
            }

            if (roleForm.formState.dirtyFields.roleId) {
                task.push(setRoleSubmit())
            }

            if (changePasswordForm.formState.dirtyFields.newPassword) {
                task.push(changePasswordSubmit({ newPassword: changePasswordForm.getValues().newPassword, changePasswordId: userId }))
            }

            if (statusForm.formState.dirtyFields.status) {
                task.push(setStatusSubmit())
            }

            const [response] = await Promise.all(task)

            return response
        } catch (error) {
            toast.error('update admin user information failed ')
        }

    }



    const password = changePasswordForm.watch('newPassword')
    const isPasswordMisMatch = confirmPassword.length !== 0 && password !== confirmPassword ? "密碼不一致 請重新輸入" : ""


    return (
        <div className='bg-gray-50 w-full h-full p-10 overflow-y-auto'>
            <div className="flex justify-between items-center">
                <div className="flex flex-col justify-center items-start gap-2">
                    <Breadcrumbs action="Edit User" route="users"/>
                    <h1 className='text-3xl font-bold'>
                        Edit User
                    </h1>
                    <h3 className="text-lg font-medium text-gray-500">Update user's status 、 role and basic information</h3>
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
                        Activity Logs
                    </button>
                </div>

                <div className="w-[75%] p-6 border-l-2 border-l-gray-200 flex flex-col gap-2">
                    <h1 className="text-2xl font-medium ">Basic Information</h1>
                    <p className="text-gray-500 text-lg">Update admin user basic information</p>

                    <div className="flex flex-col gap-4">
                        {/* 基本資料 */}
                        <form onSubmit={myProfileForm.handleSubmit(myProfileSubmit)} className="flex justify-between items-center">

                            <div className="flex justify-start items-center gap-8">
                                <div className="flex flex-col items-start gap-2">
                                    <label className="flex gap-1 font-semibold text-black">
                                        name
                                        <span className="text-sm text-red-600">*</span>
                                    </label>

                                    <input
                                        {...myProfileForm.register('name')}
                                        className="h-12 w-100 rounded-lg border-2 border-gray-500 px-3"
                                        placeholder="Enter full name"
                                        value={myProfileForm.watch('name')}

                                    />
                                </div>

                                <div className="flex flex-col items-start gap-2">
                                    <label className="flex gap-1 font-semibold text-black">
                                        email
                                        <span className="text-sm text-red-600">*</span>
                                    </label>

                                    <input
                                        {...myProfileForm.register('email')}
                                        className="h-12 w-100 rounded-lg border-2 border-gray-500 px-3"
                                        placeholder="Enter email"
                                        value={myProfileForm.watch('email')}
                                    />
                                </div>
                            </div>


                        </form>

                        {/* 變更密碼 */}
                        <form onSubmit={changePasswordForm.handleSubmit(changePasswordSubmit)} className="flex justify-between items-center">
                            <div className="flex justify-start items-center gap-8">
                                <div className="flex flex-col items-start gap-2">
                                    <label className="flex gap-1 font-semibold text-black">
                                        password
                                        <span className="text-sm text-red-600">*</span>
                                    </label>

                                    <div className="w-100 flex items-center">
                                        <input
                                            {...changePasswordForm.register('newPassword')}
                                            className="h-12 w-full border-l-2 border-t-2 border-b-2 rounded-l-lg border-gray-500 px-3"
                                            type={`${passwordDisable ? "password" : 'text'}`}

                                        />
                                        <button type="submit" className='h-12 w-[5%] border-t-2 border-r-2 border-b-2 rounded-r-lg  border-gray-500 pr-2 ' onClick={() => setPasswordDisable(!passwordDisable)}>
                                            <FaRegEyeSlash />
                                        </button>
                                    </div>


                                </div>

                                <div className="flex flex-col items-start gap-2">
                                    <label className="flex gap-1 font-semibold text-black">
                                        Confirm password
                                        <span className="text-sm text-red-600">*</span>
                                    </label>
                                    <div className="w-100 flex items-center">
                                        <input
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-12 w-full border-l-2 border-t-2 border-b-2 rounded-l-lg border-gray-500 px-3"
                                            type={`${confirmPasswordDisable ? "password" : 'text'}`}
                                            value={confirmPassword}
                                        />
                                        <button className='h-12 w-[5%] border-t-2 border-r-2 border-b-2 rounded-r-lg  border-gray-500 pr-2' onClick={() => setConfirmPasswordDisable(!confirmPasswordDisable)}>
                                            <FaRegEyeSlash />
                                        </button>
                                    </div>
                                    <p className={`text-sm text-red-500 ${isPasswordMisMatch.length === 0 ? "hidden" : ""}`}>
                                        {isPasswordMisMatch}
                                    </p>

                                </div>
                            </div>

                        </form>

                        <div className="flex justify-between items-end">

                            <div className="flex justify-start items-center gap-8">
                                <form onSubmit={roleForm.handleSubmit(setRoleSubmit)} className="flex justify-between items-center">
                                    <SelectMenu
                                        props={Roles}
                                        value={role}
                                        onSelectMenuValueChange={setRole}
                                        label='user role'
                                        selectMenuStyle={{ width: 400, borderColor: "#6a7282" }}

                                    />

                                </form>

                                {/* 帳號狀態設定 */}
                                <form onSubmit={statusForm.handleSubmit(setStatusSubmit)} className="flex justify-between items-center">
                                    <SelectMenu
                                        props={Status}
                                        value={userStatus}
                                        onSelectMenuValueChange={setUserStatus}
                                        label='user status'
                                        selectMenuStyle={{ width: 400, borderColor: "#6a7282" }}
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-100 flex justify-center items-center border-l-3 border-l-gray-200 gap-4">

                    <Link href={'/users'} className="w-30 h-15 flex justify-center items-center text-lg font-bold bg-white text-gray-400 gap-4 hover:bg-gray-400 hover:text-gray-600 border border-gray-300 rounded-xl p-4">
                        <MdOutlineCancel />
                        close
                    </Link>
                    <button onClick={() => onSubmit()} className="w-30 h-15 flex justify-center items-center text-lg font-bold bg-blue-300 text-blue-600 gap-4 hover:bg-blue-700 hover:text-white rounded-xl p-4">
                        <FaRegSave />
                        save
                    </button>
                </div>
            </div>
        </div>
    )
}