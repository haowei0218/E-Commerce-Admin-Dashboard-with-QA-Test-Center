"use client";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Role } from "@/type/Login/user.login.type";
import { RiAdminFill } from "react-icons/ri";
import { Nunito } from "next/font/google";
import { z } from "zod";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const role: Role[] = [
  {
    id: 1,
    code: "Admin",
    role_name: "系統管理員",
  },
  {
    id: 2,
    code: "Manager",
    role_name: "營運主管",
  },
  {
    id: 3,
    code: "Staff",
    role_name: "客服/營運人員",
  },
  {
    id: 4,
    code: "Viewer",
    role_name: "唯讀帳號",
  },
  {
    id: 5,
    code: "QA",
    role_name: "測試人員",
  },
  {
    id: 6,
    code: "Developer",
    role_name: "工程師",
  },
];

const formSchema = z.object({
  role: z.string().nonempty(),
  username: z.string().min(1, "請輸入帳號").max(20),
  password: z.string().min(1, "請輸入密碼").max(20),
});

type LoginForm = z.infer<typeof formSchema>;

export function page() {
  const [isRemember, setRememberAccount] = useState(false);
  const [isHiddenPassword, setHiddenPassword] = useState(true);

  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      role: "Admin",
      username: "",
      password: "",
    },
  });
  const SubmitFn: SubmitHandler<LoginForm> = (data) => console.log(data);
  const onError: SubmitHandler<LoginForm> = (errors) => console.log(errors);

  useEffect(() => {});

  return (
    <div className="login w-full h-full bg-gray-50 grid justify-center items-center">
      <div className="icon flex w-full h-20 justify-center items-center gap-2 mt-10"></div>
      <div className="login-container grid justify-center w-[550px] h-[500px] bg-white shadow-lg shadow-gray-400 rounded-2xl  mt-10">
        <div className="title w-full h-full flex justify-center items-center gap-2">
          <RiAdminFill className="text-blue-500 text-4xl" />
          <p
            className={`${nunito.className} text-2xl font-extrabold tracking-wide`}
          >
            Admin
          </p>
        </div>

        <form
          onSubmit={handleSubmit(SubmitFn)}
          className="login-form w-[600px] h-[350px] grid justify-center items-center"
        >
          <select
            className="w-full h-11 bg-gray-100 rounded-md"
            {...register("role")}
          >
            <option
              className={`text-center`}
              value={"default"}
              disabled
            >
              -- 請選擇帳戶角色 --
            </option>
            {role.map((Role) => {
              return (
                <option
                  key={Role.code}
                  className={`role_item ${nunito.className} tracking-wide text-center`}
                  value={Role.code}
                >
                  {Role.role_name}
                </option>
              );
            })}
          </select>

          <div className="input_username w-[400px] h-[80px] grid items-center">
            <label className="text-sm text-gray-700 font-extrabold tracking-wide pl-2">
              Account
            </label>
            <input
              {...register("username")}
              className="border-2 border-gray-100 p-3 rounded-xl w-full h-11 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="輸入你的帳號"
            ></input>
          </div>

          <div className="input_password w-[400px] h-[80px] grid items-center">
            <label className="text-sm text-gray-700 font-extrabold tracking-wide pl-2">
              Password
            </label>
            <input
              {...register("password")}
              className="border-2 border-gray-100 p-3 rounded-xl w-full h-11 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="輸入你的密碼"
              type={`${isHiddenPassword ? "password" : "text"}`}
            ></input>
          </div>

          <div className="w-full h-11 flex justify-between items-center gap-2">
            <div className="rememberCheck flex gap-2">
              <input
                type="checkbox"
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
                ) => setRememberAccount(!isRemember)}
              />
              <p>記住我</p>
            </div>

            <div className="hiddenPassword flex gap-2">
              <input
                type="checkbox"
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
                ) => setHiddenPassword(!isHiddenPassword)}
              />
              <p>顯示密碼</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-[400px] h-11 bg-blue-500 text-white text-xl font-extrabold tracking-wide rounded-xl hover:bg-blue-700 hover:cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
      <div className="grid w-full h-12 justify-center items-start pb-50">
        <footer className="text-gray-500">
          &copy; {new Date().getFullYear()} Test Center. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default page;
