export default function Header() {
  return (
    <header className="bg-white shadow-sm px-6 py-3 flex items-center gap-3">
      <img src="/bell.png" alt="Logo" className="w-8 h-8" />
      <h1 className="text-lg font-semibold text-gray-800">
        Reminder App
      </h1>
    </header>
  );
}
