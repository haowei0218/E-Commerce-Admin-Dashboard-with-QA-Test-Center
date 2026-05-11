import React from "react";

export function page() {
  return (
    <div className="login w-full h-full bg-gray-50 grid justify-center items-center">
      <div className="login-container grid justify-center w-[500px] h-[600px] bg-white shadow-gray-800">
        <div className="title w-full h-[80px] grid justify-center">
          <h1 className="text-3xl font-extrabold tracking-wide text-center">Admin Login</h1>
          <p className="text-l text-gray-400">Sign in access to the admin dashboard</p>
        </div>
      </div>
    </div>
  );
}

export default page;
