"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Role } from "@/type/Login/type";

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

export function page() {
  const { register, handleSubmit } = useForm();
  const [isRemember, setRememberAccount] = useState(false);

  function RememberAccount() {
    if (isRemember) {
    }
  }
  return (
    <div className="login w-full h-full bg-gray-50 grid justify-center items-center">
      <div className="login-container grid justify-center w-[550px] h-[500px] bg-white shadow-lg shadow-gray-400 rounded-2xl">
        <div className="title w-full h-10 grid justify-center pt-5">
          <h2 className="text-3xl font-extrabold tracking-wide text-center">
            Admin Login
          </h2>
          <p className="text-l text-gray-400">
            Sign in access to the admin dashboard
          </p>
        </div>

        <form className="login-form w-[600px] h-[350px] grid justify-center items-center mt-4">
          <select className="w-full h-11 bg-gray-100 rounded-md" {...register("role")}>
            <option className="text-center" value={"default"} disabled>
              -- 請選擇帳戶角色 --
            </option>
            {role.map((Role) => {
              return (
                <option
                  key={Role.code}
                  className="role_item text-center"
                  role={Role.code}
                >
                  {Role.role_name}
                </option>
              );
            })}
          </select>

          <div className="input_username w-[400px] h-[80px] grid items-center">
            <label className="text-sm text-gray-700 font-extrabold tracking-wide pl-2">Account</label>
            <input
              {...register("username")}
              className="border-2 border-gray-200 p-3 rounded-xl w-full h-11"
              placeholder="輸入你的帳號"
            ></input>
          </div>

          <div className="input_password w-[400px] h-[80px] grid items-center">
            <label className="text-sm text-gray-700 font-extrabold tracking-wide pl-2">
              Password
            </label>
            <input
              {...register("password")}
              className="border-2 border-gray-200 p-3 rounded-xl w-full h-11"
              placeholder="輸入你的密碼"
              type="password"
            ></input>
          </div>

          <div className="remember_me w-[400px] h-11 flex items-center gap-2">
            <input type="checkbox" />
            <p>記住我</p>
          </div>

          <button className="w-[400px] h-11 bg-blue-500 text-white text-xl font-extrabold tracking-wide rounded-xl" >Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default page;
