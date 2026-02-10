import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { login } from "../features/auth/authSlice";
import toast from "react-hot-toast";

export default function Auth() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = async () => {
    try {
      if (!isLogin) {
        if (password !== confirm) {
          toast.error("Passwords do not match");
          return;
        }

        if (!firstName.trim() || !lastName.trim()) {
          toast.error("First name and last name are required");
          return;
        }

        await api.post("/auth/register", {
          firstName,
          lastName,
          email,
          password,
        });
        toast.success("Registered successfully. Redirecting to login...");
        setTimeout(() => setIsLogin(true), 3000);
        return;
      } else {
        // LOGIN FLOW
        try {
          await dispatch(login({ email, password })).unwrap();
          toast.success("Login successful");
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 100);
        } catch {
          toast.error("Invalid credentials");
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-teal-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <img src="/bell.png" className="w-14 mx-auto mb-4" />

        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-[#d261e8]"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-[#d261e8]"
                value={lastName}
                placeholder="Enter your last name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email address
          </label>
          <input
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Re-enter your password"
              type="password"
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        )}

        <button
          onClick={submit}
          className="bg-teal-700 hover:bg-teal-800 transition text-white w-full py-2 rounded-md font-medium"
        >
          {isLogin ? "SIGN IN" : "SIGN UP"}
        </button>

        <p className="text-sm text-center mt-5 text-gray-600">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                className="text-teal-700 font-semibold hover:underline"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-teal-700 font-semibold hover:underline"
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
