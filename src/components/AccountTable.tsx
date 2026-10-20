import { Account } from "@/types";
import { format } from "date-fns";

const mockAccounts: Account[] = [
  { id: "1", platform: "Disney+", email: "cuenta1@test.com", profile: "Perfil 1", clientName: "Carlos Ruiz", status: "alquilada", startDate: "2023-10-01", endDate: "2023-11-01", cost: 15, type: "alquiler" },
  { id: "2", platform: "HBO Max", email: "cuenta2@test.com", profile: "Perfil 2", clientName: "Ana Torres", status: "por_vencer", startDate: "2023-10-25", endDate: "2023-10-27", cost: 10, type: "venta" },
  { id: "3", platform: "Netflix", email: "cuenta3@test.com", profile: "Perfil 1", status: "disponible", startDate: "-", endDate: "-", cost: 0, type: "alquiler" },
];

export default function AccountTable() {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Inventario de Cuentas</h3>
        <button className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg font-semibold text-sm transition">
          + Nueva Cuenta
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-black/50 text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">Plataforma</th>
              <th className="px-6 py-4">Cliente / Tipo</th>
              <th className="px-6 py-4">Vencimiento</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {mockAccounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-gray-800/50 transition">
                <td className="px-6 py-4">
                  <p className="font-bold text-white">{acc.platform}</p>
                  <p className="text-xs">{acc.email}</p>
                </td>
                <td className="px-6 py-4">
                  {acc.clientName ? (
                    <>
                      <p className="text-white">{acc.clientName}</p>
                      <p className="text-xs capitalize">{acc.type}</p>
                    </>
                  ) : (
                    <span className="text-gray-500 italic">Sin asignar</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {acc.endDate !== "-" ? (
                    <span className={acc.status === "por_vencer" ? "text-orange-500 font-bold" : "text-white"}>
                      {format(new Date(acc.endDate), "dd/MM/yyyy")}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    acc.status === 'disponible' ? 'bg-green-900/30 text-green-500' :
                    acc.status === 'alquilada' ? 'bg-blue-900/30 text-blue-500' :
                    'bg-orange-900/30 text-orange-500'
                  }`}>
                    {acc.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}