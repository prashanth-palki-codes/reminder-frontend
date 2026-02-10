import { NavLink } from "react-router-dom";

export default function SideMenu() {
  const base =
    "block px-4 py-2 rounded-md text-sm font-medium transition";
  const active =
    "bg-[#d261e8] text-white";
  const inactive =
    "text-gray-700 hover:bg-gray-100";

  return (
    <aside className="w-60 bg-white border-r min-h-screen flex flex-col">
      {/* App Name */}
      <div className="px-5 py-4 border-b">
        <h1 className="text-xl font-bold text-[#d261e8]">
          Reminder App
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Never miss anything
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Account Details
        </NavLink>
      </nav>
    </aside>
  );
}
