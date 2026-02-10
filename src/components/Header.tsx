import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import Swal from "sweetalert2";
import api from "../services/api";

export default function Header() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setName(res.data.firstName || "");
    });
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      dispatch(logout());
    }
  };

  return (
    <header className="flex justify-between items-center mb-6 border-b pb-3">
      <div className="flex items-center gap-2">
        <img src="/bell.png" className="w-8 h-8" />
        <h1 className="text-xl font-semibold text-gray-800">
          Reminder App
        </h1>
      </div>

      <header className="flex justify-between items-center">
        <div>
          <h5 className="text-2xl font-semibold text-gray-800">
            Welcome back{name && `, ${name}`} 👋
          </h5>
          <p className="text-sm text-gray-500">
            Here’s what’s coming up
          </p>
        </div>
      </header>

      <button
        onClick={handleLogout}
        className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}
