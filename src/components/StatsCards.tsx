import { Tv, Users, AlertTriangle, DollarSign } from "lucide-react";

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm mb-1">Cuentas Activas</p>
            <h3 className="text-3xl font-bold text-white">124</h3>
          </div>
          <div className="bg-green-900/30 p-2 rounded-lg text-green-500"><Tv size={24} /></div>
        </div>
      </div>

      <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm mb-1">Clientes</p>
            <h3 className="text-3xl font-bold text-white">89</h3>
          </div>
          <div className="bg-blue-900/30 p-2 rounded-lg text-blue-500"><Users size={24} /></div>
        </div>
      </div>

      <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm mb-1">Por Vencer (Hoy)</p>
            <h3 className="text-3xl font-bold text-orange-500">5</h3>
          </div>
          <div className="bg-orange-900/30 p-2 rounded-lg text-orange-500"><AlertTriangle size={24} /></div>
        </div>
      </div>

      <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm mb-1">Ingresos (Mes)</p>
            <h3 className="text-3xl font-bold text-white">S/ 1,240</h3>
          </div>
          <div className="bg-purple-900/30 p-2 rounded-lg text-purple-500"><DollarSign size={24} /></div>
        </div>
      </div>
    </div>
  );
}