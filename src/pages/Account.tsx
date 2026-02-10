import { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Account() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setFirstName(res.data.firstName || "");
      setLastName(res.data.lastName || "");
    });
  }, []);

  const save = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    try {
      setLoading(true);
      await api.put("/users/me", { firstName, lastName });
      toast.success("Account details updated");
    } catch {
      toast.error("Failed to update account details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideMenu />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Account Details
        </h2>

        <div className="bg-white p-6 rounded-lg shadow max-w-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              First Name
            </label>
            <input
              className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-700"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-700"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
          </div>

          <button
            onClick={save}
            disabled={loading}
            className="bg-teal-700 hover:opacity-90 text-white px-6 py-2 rounded-md font-medium"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
