import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-wrap justify-center items-center h-auto bg-white">
        <form
          action="#"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/admin/dashboard", { replace: true });
          }}
        >
          <h1 className="text-3xl uppercase font-normal text-gray-800 text-center">
            login
          </h1>

          <div className="flex flex-col mb-4 md:my-5">
            <label for="username" className="mb-2">
              Username
            </label>
            <input type="text" placeholder="Username" className="w-80" />
          </div>

          <div className="flex flex-col mb-4 md:my-5">
            <label for="password" className="mb-2">
              Password
            </label>
            <input type="password" placeholder="Password" className="w-80" />
          </div>

          <button
            type="submit"
            className="bg-blue-900 text-white py-3 px-10 rounded-none"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
