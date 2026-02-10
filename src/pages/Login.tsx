import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import type { AppDispatch } from "../app/store";
import Header from "./Header";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg w-full max-w-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
            Reminder App Login
            </h2>

            <div className="space-y-4">
            <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={() => dispatch(login({ email, password }))}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
                Login
            </button>
            </div>
        </div>
        </div>
    </>
  );
}
