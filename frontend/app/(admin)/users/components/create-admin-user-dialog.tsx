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

    async function onSubmit(data: UserInformation) {
        try {
            await createAdminUser({
                ...data,
                roleId: Number(data.roleId),
            })
            toast.success('create successfully')
            setOpen(false)
            refresh()
        } catch (error) {
            console.error(error)
        }

    }
    const password = watch('passwordHash')
    const isPasswordMisMatch = confirmPassword.length !== 0 && password !== confirmPassword ? "密碼不一致 請重新輸入" : ""
    const submitDisable = watch('name').length === 0 || watch('roleId') === 0 || watch('email').length === 0 || watch('passwordHash').length === 0 || watch('status').length === 0
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
                        className="flex justify-center items-center w-40 h-9 border border-blue-500 rounded-lg bg-white font-medium text-blue-500 gap-2 hover:bg-blue-700 hover:text-white hover:cursor-pointer"
                    />
                }
            >
                <TiUserAdd size={24} />
                Create User
            </DialogTrigger>

            <DialogContent style={{
                width: "900px",
                maxWidth: "90vw",
                background: "white"
            }}>
                <DialogHeader>
                    <DialogTitle className='text-2xl'>Create Admin User</DialogTitle>
                    <DialogDescription>
                        Create a new system user and assign their access.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl">

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-5">
                        <div className="flex flex-col items-start gap-2">
                            <label className="flex gap-1 text-lg font-bold">
                                Name
                                <span className="text-sm text-red-600">*</span>
                            </label>

                            <input
                                {...register('name')}
                                className=" h-10 w-full rounded-xl border-2 border-gray-200 px-3"
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
                            <DialogClose
                                render={
                                    <button
                                        type="button"
                                        className="w-30 h-9 border border-gray-500 rounded-lg bg-white text-gray-500 font-bold hover:bg-gray-700 hover:text-white hover:cursor-pointer"
                                    />
                                }
                            >
                                Cancel
                            </DialogClose>

                            <button className="w-30 h-9 border flex justify-center items-center border-blue-500 rounded-lg text-blue-500 font-bold  gap-2 hover:bg-blue-700 disabled:text-gray-500 disabled:border-gray-500 disabled:bg-white" disabled={submitDisable || isSubmitting} type="submit">{isSubmitting && <ImSpinner2 className="animate-spin" />}
                                {isSubmitting ? 'Creating...' : 'Create User'}</button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}