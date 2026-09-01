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
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { createAdminUser } from "@/lib/user.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImSpinner2 } from 'react-icons/im'



export default function createUser() {
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [passwordDisable, setPasswordDisable] = useState<boolean>(true)
    const [confirmPasswordDisable, setConfirmPasswordDisable] = useState<boolean>(true)
    const router = useRouter()
    const userInfo = z.object({
        name: z.string().min(1).max(30),
        roleId: z.number(),
        email: z.email(),
        passwordHash: z.string().min(1).max(30),
        status: z.string()
    })

    type UserInformation = z.infer<typeof userInfo>

    const { register, handleSubmit, watch, formState: { errors, isSubmitting, isSubmitted } } = useForm<UserInformation>({
        defaultValues: {
            name: "",
            roleId: 0,
            email: "",
            passwordHash: "",
            status: ""
        }
    })

    async function onSubmit(data: UserInformation) {
        try {
            const response = await createAdminUser({
                ...data,
                roleId: Number(data.roleId),
            })
            console.log(response)
            toast.success('create successfully')
            router.push('/users')
        } catch (error) {
            console.error(error)
        }

    }
    const password = watch('passwordHash')
    const isPasswordMisMatch = confirmPassword.length !== 0 && password !== confirmPassword ? "密碼不一致 請重新輸入" : ""
    const submitDisable = watch('name').length === 0 || watch('roleId') === 0 || watch('email').length === 0 || watch('passwordHash').length === 0 || watch('status').length === 0

    return (
        <div className='w-full h-full flex'>
            <NavigationBar navigaionbarList={navigationBarList} />
            <div className='min-w-0 flex-1 flex flex-col'>
                <Header />
                <div className='bg-gray-50 w-full h-full p-5 flex gap-2'>
                    <div className="flex items-start gap-10 w-50">
                        <button className="flex items-center gap-2 hover:text-blue-900 hover:cursor-pointer">
                            <FaLongArrowAltLeft className="font-normal text-blue-500" />
                            <Link href='/users' className="text-lg font-normal text-blue-500">Back to users</Link>
                        </button>

                    </div>
                    <div className="w-full">
                        <PageTitle mainTitle="Create User" subTitle="Create a new system user and assign their access." />
                        <form onSubmit={handleSubmit(onSubmit)} className=" w-full max-w-6xl mt-10 border border-gray-300 rounded-2xl bg-white p-10 ">
                            <h1 className="text-2xl font-black mb-10">User Information</h1>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-5">
                                <div className="flex flex-col items-start gap-2">
                                    <label className="flex gap-1 text-lg font-bold">
                                        Name
                                        <span className="text-sm text-red-600">*</span>
                                    </label>

                                    <input
                                        {...register('name')}
                                        className="h-10 w-full rounded-xl border-2 border-gray-200 px-3"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div className="flex flex-col items-start gap-2">
                                    <label className="flex gap-1 text-lg font-bold">
                                        Email
                                        <span className="text-sm text-red-600">*</span>
                                    </label>

                                    <input
                                        {...register('email')}
                                        className="h-10 w-full rounded-xl border-2 border-gray-200 px-3"
                                        placeholder="example@gmail.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-5">
                                <div className="flex flex-col items-start gap-2">
                                    <label className="flex gap-1 text-lg font-bold">
                                        Role
                                        <span className="text-sm text-red-600">*</span>
                                    </label>

                                    <div className="relative w-full">
                                        <select {...register('roleId')} className="h-10 w-full rounded-xl border-2 appearance-none border-gray-200 px-3 text-gray-500 font-bold">
                                            <option value={0} className="">Select role</option>
                                            <option value={2}>營運主管</option>
                                            <option value={3}>客服／營運人員</option>
                                            <option value={4}>唯讀帳號</option>
                                            <option value={5}>測試人員</option>
                                            <option value={6}>工程師</option>
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

                                <div className="flex flex-col items-start gap-2">
                                    <label className="flex gap-1 text-lg font-bold">
                                        Status
                                        <span className="text-sm text-red-600">*</span>
                                    </label>
                                    <div className="relative w-full">
                                        <select {...register('status')} className="h-10 w-full rounded-xl border-2 appearance-none border-gray-200 px-3 text-gray-500 text-md font-bold">
                                            <option value="">Select status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>

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

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-15">
                                <div className="flex flex-col items-start gap-2">
                                    <label className="flex gap-1 text-lg font-bold">
                                        Password
                                        <span className="text-sm text-red-600">*</span>
                                    </label>

                                    <div className="w-full flex items-center">
                                        <input
                                            {...register('passwordHash')}
                                            className="h-10 w-[95%] border-l-2 border-t-2 border-b-2 rounded-l-xl border-gray-200 px-3"
                                            type={`${passwordDisable ? "password" : 'text'}`}
                                            placeholder="Enter password"
                                        />
                                        <button className='h-10 w-[5%] border-t-2 border-r-2 border-b-2 rounded-r-xl  border-gray-200 pr-2 ' onClick={() => setPasswordDisable(!passwordDisable)}>
                                            <FaRegEyeSlash />
                                        </button>
                                    </div>

                                    {errors.passwordHash && (
                                        <p className="text-sm text-red-500">
                                            {errors.passwordHash.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-start gap-2">
                                    <label className="flex gap-1 text-lg font-bold">
                                        Confirm password
                                        <span className="text-sm text-red-600">*</span>
                                    </label>
                                    <div className="w-full flex items-center">
                                        <input
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-10 w-[95%] border-l-2 border-t-2 border-b-2 rounded-l-xl border-gray-200 px-3"
                                            type={`${confirmPasswordDisable ? "password" : 'text'}`}
                                            value={confirmPassword}
                                            placeholder="Enter confirm password"
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

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="w-full flex items-end gap-2"></div>
                                <div className="w-full flex items-end justify-end gap-2">
                                    <Link className="w-30 h-9 border border-gray-300 rounded-lg bg-white font-bold  gap-2 hover:bg-gray-700 hover:text-white hover:cursor-pointer text-center pt-1" href={"/users"}>Cancel</Link>
                                    <button className="w-30 h-9 border flex justify-center items-center border-gray-300 rounded-lg bg-blue-500 font-bold text-white gap-2 hover:bg-blue-700 disabled:bg-gray-400" disabled={submitDisable || isSubmitting} type="submit">{isSubmitting && <ImSpinner2 className="animate-spin" />}
                                        {isSubmitting ? 'Creating...' : 'Create User'}</button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}