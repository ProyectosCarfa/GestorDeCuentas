import { LayoutDashboard, Tv, Users, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#111] min-h-screen border-r border-gray-800 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="bg-green-500 text-black font-bold text-xl px-2 py-1 rounded">DM</div>
        <span className="text-xl font-bold tracking-wider text-white">Gestor DM</span>
      </div>
      
      <nav className="flex flex-col gap-2 text-gray-400 flex-1">
        <Link href="/dashboard" className="flex items-center gap-3 bg-green-500/10 text-green-500 px-4 py-3 rounded-lg font-medium">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <a href="#" className="flex items-center gap-3 hover:bg-gray-800 px-4 py-3 rounded-lg transition">
          <Tv size={20} /> Inventario
        </a>
        <a href="#" className="flex items-center gap-3 hover:bg-gray-800 px-4 py-3 rounded-lg transition">
          <Users size={20} /> Clientes
        </a>
        <a href="#" className="flex items-center gap-3 hover:bg-gray-800 px-4 py-3 rounded-lg transition">
          <Settings size={20} /> Configuración
        </a>
      </nav>
      
      <Link href="/" className="flex items-center gap-3 hover:bg-red-500/10 hover:text-red-500 text-gray-400 px-4 py-3 rounded-lg transition mt-auto">
        <LogOut size={20} /> Cerrar Sesión
      </Link>
    </aside>
  );
}