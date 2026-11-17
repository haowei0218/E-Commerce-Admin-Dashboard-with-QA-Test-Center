'use client'

import { FaBullseye, FaLongArrowAltLeft } from "react-icons/fa";
import PageTitle from "@/components/ui/PageTitle";
import Link from "next/link";
import { promise, z } from 'zod'
import { useForm } from "react-hook-form";
import { RiArrowDropDownLine } from 'react-icons/ri'
import { useEffect, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { changePassword, getAdminUserTimeLine, setAdminUserActive, setAdminUserRole, updateMyProfile } from "@/lib/user.api";
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
import { CiUser } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { getActiveLog } from "@/lib/active-log.api";



export default function editUser() {
    const params = useParams<{ id: string }>()
    const userId = params.id ?? ""

    const [operatorUser, setOperatorUser] = useState<loginUserProfile | null>(null)
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [passwordDisable, setPasswordDisable] = useState<boolean>(true)
    const [confirmPasswordDisable, setConfirmPasswordDisable] = useState<boolean>(true)
    const [role, setRole] = useState<string>('All')
    const [userStatus, setUserStatus] = useState<string>('All')
    const [isSaving, setSaveStatus] = useState<boolean>(false)
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

    const adminUserActiveLogQuery = useQuery({
        queryKey: ['admin-user-active-log'],
        queryFn: () => getActiveLog(userId),
        enabled: Boolean(userId)
    })

    const adminUserActiveLog = adminUserActiveLogQuery.data?.ActivityLogs
    console.log('event : ', adminUserActiveLog?.map((item) => item.create_at))

    const adminUserTimeLineQuery = useQuery({
        queryKey: ['admin-user-timeline'],
        queryFn: () => getAdminUserTimeLine(userId),
        enabled: Boolean(userId)
    })

    const adminUserTimeLine = adminUserTimeLineQuery.data?.GetAdminUserTimeLine

    console.log('time line ', adminUserTimeLine)

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

    const { reset: resetProfile } = myProfileForm;

    useEffect(() => {
        if (!adminUser) return;

        resetProfile({
            name: adminUser.name ?? "",
            email: adminUser.email ?? "",
        });
    }, [adminUser, resetProfile]);

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
    const password = changePasswordForm.watch('newPassword')
    const isPasswordMisMatch = confirmPassword.length !== 0 && password !== confirmPassword ? "密碼不一致 請重新輸入" : ""

    async function onSubmit() {
        if (isSaving) return
        const wantsPasswordChange = password !== '' || confirmPassword !== '';
        if (wantsPasswordChange && (!password || password !== confirmPassword)) {
            toast.warning('請輸入新密碼，並確認兩次輸入一致');
            return;
        }

        const task = [];

        if (myProfileForm.formState.dirtyFields.email || myProfileForm.formState.dirtyFields.name) {
            task.push(myProfileSubmit(myProfileForm.getValues()))
        }

        if (role !== String(adminUser?.role_id)) {
            task.push(setRoleSubmit());
        }

        if (userStatus !== adminUser?.status) {
            task.push(setStatusSubmit());
        }

        if (wantsPasswordChange) {
            task.push(changePasswordSubmit({ newPassword: changePasswordForm.getValues().newPassword, changePasswordId: userId }))
        }

        if (task.length === 0) { toast.info('沒有需要儲存的變更'); return }

        setSaveStatus(true);

        try {
            const [response] = await Promise.all(task)
        } catch {
            toast.error('儲存失敗，請稍後再試');
        } finally {
            setSaveStatus(false);
        }


    }


    return (
        <div className='bg-gray-50 w-full h-full p-5 overflow-y-auto'>
            <div className="flex justify-between items-center">
                <div className="flex flex-col justify-center items-start gap-2">
                    <h1 className='text-xl font-bold'>
                        View User Active Log & Edit User
                    </h1>
                </div>
                <button className="flex w-50 h-15 justify-center items-center gap-2 hover:bg-gray-300 hover:cursor-pointer border-2 border-gray-300 rounded-lg bg-white" >
                    <FaLongArrowAltLeft className="font-normal text-black" />
                    <Link href='/users' className="text-lg font-normal text-black">Back to users</Link>
                </button>
            </div>

            <div className="flex gap-5 mt-10 w-full">
                <div className="p-2 rounded-xl bg-white shadow shadow-gray-400">
                    <button className="group flex h-15 w-full items-center justify-start gap-4 rounded-xl p-2 hover:bg-blue-200 hover:text-blue-500">
                        <MdOutlineManageAccounts size={24} className="text-gray-700 group-hover:text-blue-500" />
                        <span className="flex flex-col items-start">
                            <span className="text-lg font-medium text-gray-700 group-hover:text-blue-500">
                                Basic Information
                            </span>
                            <span className="text-sm font-medium text-gray-400 group-hover:text-blue-500">
                                User profile, role and status
                            </span>
                        </span>
                    </button>
                    <button className="group flex h-15 w-full items-center justify-start gap-4 rounded-xl p-2 hover:bg-blue-200 hover:text-blue-500">
                        <FaRegFileAlt size={24} className="text-gray-700 group-hover:text-blue-500" />
                        <span className="flex flex-col items-start">
                            <span className="text-lg font-medium text-gray-700 group-hover:text-blue-500">
                                Active Log
                            </span>
                            <span className="text-sm font-medium text-gray-400 group-hover:text-blue-500">
                                View user active log
                            </span>
                        </span>
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className=" p-4 bg-white rounded-lg flex flex-col gap-6 shadow shadow-gray-400">

                        <div className="flex gap-2 items-center border-b-2 border-b-gray-200 py-5">
                            <CiUser size={30} className="text-blue-500 font-medium" />
                            <div className="grid ">
                                <h1 className="text-xl font-medium ">Basic Information</h1>
                                <p className="text-sm text-gray-400 font-medium">Update user's basic information</p>
                            </div>

                        </div>
                        <div className="flex flex-col gap-4 not-only: ">
                            {/* 基本資料 */}

                            <div className="flex flex-col gap-4 justify-between items-center bg-white rounded-lg ">
                                <form onSubmit={myProfileForm.handleSubmit(myProfileSubmit)} >

                                    <div className="flex justify-start items-center gap-8">
                                        <div className="flex flex-col items-start gap-2">
                                            <label className="flex gap-1 font-bold text-black">
                                                name
                                                <span className="text-sm text-red-600">*</span>
                                            </label>

                                            <div className="w-100 flex items-center">
                                                <div className='h-12 p-2 flex items-center border-t-2 border-l-2 border-b-2 rounded-l-lg  border-gray-200 pr-2 ' >
                                                    <CiUser size={15} />
                                                </div>
                                                <input
                                                    {...myProfileForm.register('name')}
                                                    className="h-12 w-full border-r-2 border-t-2 border-b-2 rounded-r-lg border-gray-200 px-3 focus:outline-none"
                                                    placeholder="Enter full name"
                                                    value={myProfileForm.watch('name')}

                                                />
                                            </div>


                                        </div>

                                        <div className="flex flex-col items-start gap-2">
                                            <label className="flex gap-1  font-bold text-black">
                                                email
                                                <span className="text-sm text-red-600">*</span>
                                            </label>

                                            <div className="w-100 flex items-center">
                                                <div className='h-12 p-2 flex items-center border-t-2 border-l-2 border-b-2 rounded-l-lg  border-gray-200 pr-2 ' >
                                                    <MdOutlineMarkEmailUnread size={15} />
                                                </div>
                                                <input
                                                    {...myProfileForm.register('email')}
                                                    className="h-12 w-full border-r-2 border-t-2 border-b-2 rounded-r-lg border-gray-200 px-3 focus:outline-none"
                                                    placeholder="Enter full email"
                                                    value={myProfileForm.watch('email')}

                                                />
                                            </div>

                                        </div>
                                    </div>


                                </form>
                                <form onSubmit={changePasswordForm.handleSubmit(changePasswordSubmit)} className="flex justify-between items-center ">
                                    <div className="flex justify-start items-center gap-8">
                                        <div className="flex flex-col items-start gap-2">
                                            <label className="flex gap-1  font-bold text-black">
                                                password
                                                <span className="text-sm text-red-600">*</span>
                                            </label>

                                            <div className="w-100 flex items-center">
                                                <div className='h-12 p-2 flex items-center border-t-2 border-l-2 border-b-2 rounded-l-lg  border-gray-200 pr-2 ' >
                                                    <CiLock size={15} />
                                                </div>
                                                <input
                                                    {...changePasswordForm.register('newPassword')}
                                                    className="h-12 w-full border-t-2 border-b-2  border-gray-200 px-3 focus:outline-none"
                                                    type={`${passwordDisable ? "password" : 'text'}`}

                                                />
                                                <button type="submit" className='h-12 w-[5%] border-t-2 border-r-2 border-b-2 rounded-r-lg  border-gray-200 pr-2 ' onClick={() => setPasswordDisable(!passwordDisable)}>
                                                    <FaRegEyeSlash />
                                                </button>
                                            </div>


                                        </div>

                                        <div className="flex flex-col items-start gap-2">
                                            <label className="flex gap-1  font-bold text-black">
                                                Confirm password
                                                <span className="text-sm text-red-600">*</span>
                                            </label>
                                            <div className="w-100 flex items-center">
                                                <div className='h-12 p-2 flex items-center border-t-2 border-l-2 border-b-2 rounded-l-lg  border-gray-200 pr-2 ' >
                                                    <CiLock size={15} />
                                                </div>
                                                <input
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="h-12 w-full  border-t-2 border-b-2  border-gray-200 px-3 focus:outline-none"
                                                    type={`${confirmPasswordDisable ? "password" : 'text'}`}
                                                    value={confirmPassword}
                                                />
                                                <button className='h-12 w-[5%] border-t-2 border-r-2 border-b-2 rounded-r-lg  border-gray-200 pr-2' onClick={() => setConfirmPasswordDisable(!confirmPasswordDisable)}>
                                                    <FaRegEyeSlash />
                                                </button>
                                            </div>
                                            <p className={`text-sm text-red-500 ${isPasswordMisMatch.length === 0 ? "hidden" : ""}`}>
                                                {isPasswordMisMatch}
                                            </p>

                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow shadow-gray-400">
                        <div className="flex gap-4 items-center border-b-2 border-b-gray-200 py-5 ">
                            <AiFillSafetyCertificate size={30} className="text-blue-500 font-medium" />
                            <div className="grid ">
                                <h1 className="text-xl font-medium ">Access & Permissions</h1>
                                <p className="text-sm text-gray-400 font-medium">Manage the user's role and account status</p>
                            </div>

                        </div>

                        <div className="flex justify-start items-center gap-8 mt-5">
                            <form onSubmit={roleForm.handleSubmit(setRoleSubmit)} className="flex justify-between items-center">
                                <SelectMenu
                                    props={Roles}
                                    value={role}
                                    onSelectMenuValueChange={setRole}
                                    label='user role'
                                    selectMenuStyle={{ width: "400px", borderColor: "#6a7282" }}

                                />

                            </form>

                            {/* 帳號狀態設定 */}
                            <form onSubmit={statusForm.handleSubmit(setStatusSubmit)} className="flex justify-between items-center">
                                <SelectMenu
                                    props={Status}
                                    value={userStatus}
                                    onSelectMenuValueChange={setUserStatus}
                                    label='user status'
                                    selectMenuStyle={{ width: "400px", borderColor: "#6a7282" }}
                                />
                            </form>
                        </div>
                    </div>

                    <div className=" bg-white shadow shadow-gray-400 rounded-lg p-4 flex items-center justify-end gap-4">

                        <Link href={'/users'} className="w-45 h-12 flex justify-center items-center text-lg font-bold bg-white text-gray-500 gap-4 hover:bg-gray-400 hover:text-gray-600 border border-gray-300 rounded-xl p-4">

                            cancel
                        </Link>
                        <button type="submit" onClick={() => onSubmit()} className="w-45 h-12 flex justify-center items-center text-md font-bold bg-blue-500 text-white gap-4 hover:bg-blue-700  rounded-xl p-4">
                            {isSaving ? "saving change..." : "save change"}
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow shadow-gray-400 w-107">
                    <h1 className="text-xl font-medium ">Account OverView</h1>

                    <div className="border-b-2 border-b-gray-200 grid gap-5 py-5">
                        <div >
                            <span className="font-bold text-gray-500">Created On</span>
                            {adminUserTimeLineQuery.isLoading && <p>載入中...</p>}
                            {adminUserTimeLine && <p>{formatDate(adminUserTimeLine.createdAt)}</p>}
                        </div>
                        <div >
                            <span className="font-bold text-gray-500">Last Login</span>
                            {adminUserTimeLineQuery.isLoading && <p>載入中...</p>}
                            {adminUserTimeLine && <p>{formatDate(adminUserTimeLine.lastLoginAt)}</p>}
                        </div>
                        <div >
                            <span className="font-bold text-gray-500">Last Update</span>
                            {adminUserTimeLineQuery.isLoading && <p>載入中...</p>}
                            {adminUserTimeLine && <p>{formatDate(adminUserTimeLine.lastUpdateAt)}</p>}
                        </div>
                    </div>

                    <h1 className="text-xl font-medium mt-5">Last 5 Activities</h1>

                    <div className="grid gap-5 py-5">
                        {adminUserActiveLogQuery.isLoading && <span className="m-auto">正在取得資料...</span>}
                        {adminUserActiveLog && adminUserActiveLog.length === 0 && <span>無任何活動紀錄</span>}

                        {adminUserActiveLog && adminUserActiveLog?.slice(0, 5).map((item) => {
                            return (
                                <div className="font-bold " key={item.id}>
                                    <span className="text-sm line-clamp-1">{item.description}</span>
                                    <p className="text-gray-500  text-xs">{formatDate(item.create_at)}</p>
                                </div>
                            )
                        })}
                    </div>


                </div>




            </div>
        </div>
    )
}