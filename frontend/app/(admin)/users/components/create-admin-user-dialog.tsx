import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { TiUserAdd } from "react-icons/ti"
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { RiArrowDropDownLine } from 'react-icons/ri'
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { createAdminUser } from "@/lib/user.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImSpinner2 } from 'react-icons/im'
import { refresh } from "next/cache";
import { CiUser } from "react-icons/ci";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { IoLockClosedOutline, IoReturnDownBack } from "react-icons/io5";

export default function CreateAdminUserDialog() {
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [passwordDisable, setPasswordDisable] = useState<boolean>(true)
    const [confirmPasswordDisable, setConfirmPasswordDisable] = useState<boolean>(true)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const userInfo = z.object({
        name: z.string().min(1).max(30),
        roleId: z.number(),
        email: z.email(),
        passwordHash: z.string().min(1).max(30),
        status: z.string()
    })

    type UserInformation = z.infer<typeof userInfo>

    const { register, handleSubmit, watch, formState: { errors, isSubmitting, isSubmitted }, reset } = useForm<UserInformation>({
        defaultValues: {
            name: "",
            roleId: 0,
            email: "",
            passwordHash: "",
            status: ""
        }
    })


    const password = watch('passwordHash')
    const isPasswordMisMatch = confirmPassword.length !== 0 && password !== confirmPassword ? "密碼不一致 請重新輸入" : ""
    const submitDisable = watch('name').length === 0 || watch('roleId') === 0 || watch('email').length === 0 || watch('passwordHash').length === 0 || watch('status').length === 0
    async function onSubmit(data: UserInformation) {
        try {
            if (submitDisable) { toast.info('有必要欄位未填寫'); return }
            await createAdminUser({
                ...data,
                roleId: Number(data.roleId),
            })
            toast.success('create successfully')
            setOpen(false)
        } catch (error) {
            console.error(error)
        }

    }
    return (
        <Dialog open={open} onOpenChange={(value) => {
            setOpen(value)

            if (!value) {
                reset()
                setConfirmPassword("")
            }
        }}>
            <DialogTrigger
                render={
                    <button
                        type="button"
                        className="flex justify-center items-center w-45 h-12  rounded-lg font-normal text-lg  gap-3 bg-blue-600 text-white  hover:bg-blue-700 hover:cursor-pointer"
                    />
                }
            >
                <TiUserAdd size={24} />
                Create User
            </DialogTrigger>

            <DialogContent style={{
                width: "900px",
                maxWidth: "90vw",
                background: "white",
                border: 0
            }}>
                <DialogHeader>
                    <DialogTitle className='text-2xl'>Create User</DialogTitle>
                    <DialogDescription className={'text-gray-500 text-sm'}>
                        Create a new system user and assign their access and permissions.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl">

                    <div className="border-2 border-gray-200 rounded-lg p-4 mb-5">
                        <div className="flex gap-2 items-center mb-6">
                            <CiUser size={40} className="text-blue-500 font-bold" />
                            <div className="grid ">
                                <h1 className="text-xl font-medium ">Basic Information</h1>
                                <p className="text-sm text-gray-400 font-medium">Enter the user's basic information</p>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-5">
                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-bold">
                                    name
                                    <span className="text-sm text-red-600">*</span>
                                </label>

                                <input
                                    {...register('name')}
                                    className=" h-10 w-full rounded-md border-2 border-gray-200 px-3 focus:outline-none"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-bold">
                                    email
                                    <span className="text-sm text-red-600">*</span>
                                </label>

                                <input
                                    {...register('email')}
                                    className="h-10 w-full rounded-md border-2 border-gray-200 px-3 focus:outline-none"
                                    placeholder="example@gmail.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-2 border-gray-200 rounded-lg p-4 mb-5">
                        <div className="flex gap-4 items-center mb-6">
                            <AiFillSafetyCertificate size={40} className="text-blue-500 font-bold" />
                            <div className="grid ">
                                <h1 className="text-xl font-medium ">Access & Permissions</h1>
                                <p className="text-sm text-gray-400 font-medium">Assign the role and set account status.</p>
                            </div>

                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-5">
                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-bold">
                                    user role
                                    <span className="text-sm text-red-600">*</span>
                                </label>

                                <div className="relative w-full">
                                    <select {...register('roleId')} className="h-10 w-full rounded-md border-2 appearance-none border-gray-200 px-3 text-gray-400 text-md font-normal focus:outline-none">
                                        <option value={0} className="">Select Role</option>
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
                                    user status
                                    <span className="text-sm text-red-600">*</span>
                                </label>
                                <div className="relative w-full">
                                    <select {...register('status')} className="h-10 w-full rounded-md  border-2 appearance-none border-gray-200 px-3 text-gray-400 text-md font-normal focus:outline-none">
                                        <option value="">Set account status</option>
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

                        </div>
                    </div>


                    <div className="border-2 border-gray-200 rounded-lg p-4 mb-5">
                        <div className="flex gap-4 items-center mb-6">
                            <IoLockClosedOutline size={40} className="text-blue-500 font-bold" />
                            <div className="grid ">
                                <h1 className="text-xl font-medium ">Password</h1>
                                <p className="text-sm text-gray-400 font-medium">Set the user's initial password.</p>
                            </div>

                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="flex flex-col items-start gap-2">
                                <label className="flex gap-1 text-lg font-bold">
                                    password
                                    <span className="text-sm text-red-600">*</span>
                                </label>

                                <div className="w-full flex items-center">
                                    <input
                                        {...register('passwordHash')}
                                        className="h-10 w-[95%] border-l-2 border-t-2 border-b-2 rounded-l-md border-gray-200 px-3"
                                        type={`${passwordDisable ? "password" : 'text'}`}
                                        placeholder="Enter password"
                                    />
                                    <button className='h-10 w-[5%] border-t-2 border-r-2 border-b-2 rounded-r-md  border-gray-200 pr-2 ' onClick={() => setPasswordDisable(!passwordDisable)}>
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
                                    confirm password
                                    <span className="text-sm text-red-600">*</span>
                                </label>
                                <div className="w-full flex items-center">
                                    <input
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-10 w-[95%] border-l-2 border-t-2 border-b-2 rounded-l-md border-gray-200 px-3"
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
                    </div>



                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="w-full flex items-end gap-2"></div>
                        <div className="w-full flex items-end justify-end gap-2">
                            <DialogClose
                                render={
                                    <button
                                        type="button"
                                        className="w-30 h-9 border border-gray-500 rounded-lg bg-white text-gray-500 font-bold hover:bg-gray-700 hover:text-white hover:cursor-pointer"
                                    />
                                }
                            >
                                cancel
                            </DialogClose>

                            <button className="w-30 h-9 border flex justify-center items-center text-md font-bold bg-blue-500 text-white gap-4 hover:bg-blue-700  rounded-lg p-4 " disabled={submitDisable || isSubmitting} type="submit">{isSubmitting && <ImSpinner2 className="animate-spin" />}
                                {isSubmitting ? 'creating...' : 'save'}</button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}