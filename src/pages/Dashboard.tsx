import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "../components/SideMenu";
import Header from "../components/Header";
import {
  fetchReminders,
  deleteReminder,
} from "../features/reminders/reminderSlice";
import api from "../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Dashboard() {
  const dispatch = useDispatch<any>();
  const reminders = useSelector((s: any) => s.reminders.list);

  /* existing states */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  /* NEW: filter state */
  const [filter, setFilter] =
    useState<"all" | "week" | "month">("all");

  useEffect(() => {
    dispatch(fetchReminders());
  }, []);

  /* helpers */
  const now = new Date();

  const isThisWeek = (date: string) => {
    const d = new Date(date);
    const diff =
      (d.getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };

  const isThisMonth = (date: string) => {
    const d = new Date(date);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const filteredReminders = reminders.filter((r: any) => {
    if (filter === "week") return isThisWeek(r.remindAt);
    if (filter === "month") return isThisMonth(r.remindAt);
    return true;
  });

  const upcomingReminders = filteredReminders.filter(
    (r: any) => new Date(r.remindAt) >= now
  );

  const pastReminders = filteredReminders.filter(
    (r: any) => new Date(r.remindAt) < now
  );

  /* existing logic */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRemindAt("");
    setEditingId(null);
  };

  const submitReminder = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!remindAt) {
      toast.error("Date & time is required");
      return;
    }

    if (new Date(remindAt) <= new Date()) {
      toast.error("Date must be in the future");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/reminders/${editingId}`, {
          title,
          description,
          remindAt: new Date(remindAt).toISOString(),
        });
        toast.success("Reminder updated");
      } else {
        await api.post("/reminders", {
          title,
          description,
          remindAt: new Date(remindAt).toISOString(),
        });
        toast.success("Reminder added");
      }

      resetForm();
      dispatch(fetchReminders());
    } catch {
      toast.error("Something went wrong");
    }
  };

  const startEdit = (r: any) => {
    setEditingId(r._id);
    setTitle(r.title);
    setDescription(r.description || "");
    setRemindAt(r.remindAt.slice(0, 16));
  };

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Delete reminder?",
      text: `Are you sure you want to delete "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    await dispatch(deleteReminder(id)).unwrap();
    toast.success("Reminder deleted");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideMenu />

      <div className="flex-1 p-6">
        <Header />

        {/* CREATE / EDIT */}
        <div className="bg-white p-5 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Reminder" : "Create Reminder"}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <input
                className="border rounded-md p-2 w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Description (optional)
              </label>
              <textarea
                className="border rounded-md p-2 w-full"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Remind At *
              </label>
              <input
                type="datetime-local"
                className="border rounded-md p-2 w-full"
                value={remindAt}
                onChange={(e) =>
                  setRemindAt(e.target.value)
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitReminder}
                className="bg-teal-700 text-white px-5 py-2 rounded-md"
              >
                {editingId ? "Update" : "Add"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="bg-gray-300 px-5 py-2 rounded-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "week", label: "This Week" },
            { key: "month", label: "This Month" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-3 py-1 rounded-full text-sm border ${
                filter === f.key
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* UPCOMING */}
        <h3 className="text-lg font-semibold mb-3">
          Upcoming Reminders
        </h3>

        {upcomingReminders.length === 0 && (
          <p className="text-sm text-gray-500 mb-6">
            No upcoming reminders
          </p>
        )}

        <ul className="space-y-4 mb-10">
          {upcomingReminders.map((r: any) => (
            <li
              key={r._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between"
            >
              <div>
                <h4 className="font-semibold">{r.title}</h4>
                {r.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {r.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(r.remindAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(r)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleDelete(r._id, r.title)
                  }
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* PAST */}
        <h3 className="text-lg font-semibold mb-3">
          Past Reminders
        </h3>

        {pastReminders.length === 0 && (
          <p className="text-sm text-gray-500">
            No past reminders
          </p>
        )}

        <ul className="space-y-4">
          {pastReminders.map((r: any) => (
            <li
              key={r._id}
              className="bg-gray-50 p-4 rounded-lg border"
            >
              <h4 className="font-semibold">{r.title}</h4>
              {r.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {r.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(r.remindAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
