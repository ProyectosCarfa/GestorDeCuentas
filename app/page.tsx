import { CheckCircle, Link as LinkIcon, ShieldCheck, ArrowRight, Play, Sparkles, Users, LayoutDashboard, MonitorPlay, UserPlus, CalendarDays, MessageCircle, Zap, Server, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const platforms = ["Netflix", "Disney+", "HBO Max", "Prime Video", "Spotify", "YouTube Premium", "Crunchyroll", "Apple TV+"];

  return (
    <div className="min-h-screen bg-[#000000] text-[#F4F4F5] font-sans selection:bg-[#E50914] selection:text-white flex justify-center">
      
      <div className="w-full max-w-6xl flex flex-col bg-[#000000]">
        
        <nav className="flex items-center justify-between px-6 py-4 border-b border-[#292930] bg-[#000000] sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-[#292930] overflow-hidden bg-[#1B1B21]">
               <Image src="/avatar.png" alt="Logo" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold tracking-wide text-[#F4F4F5]">
              AlexStreaming <span className="text-[#E50914]">GDC</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#A1A1AA]">
            <a href="#features" className="hover:text-[#F4F4F5] transition-colors duration-150">Plataforma</a>
            <a href="#how" className="hover:text-[#F4F4F5] transition-colors duration-150">Operativa</a>
            <a href="#security" className="hover:text-[#F4F4F5] transition-colors duration-150">Seguridad</a>
          </div>

          <Link href="/dashboard" className="bg-[#E50914] text-white px-5 py-2 rounded text-xs font-bold hover:bg-[#FF2934] transition-colors duration-150 flex items-center gap-2">
            Acceder al Panel <ChevronRight size={14} />
          </Link>
        </nav>

        <div className="px-6 py-16 md:py-20 border-b border-[#292930] relative bg-[#000000] grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 border border-[#292930] bg-[#0D0D10] px-3 py-1 rounded text-[10px] font-bold text-[#A1A1AA] mb-6 tracking-widest uppercase">
              <Sparkles size={12} className="text-[#E50914]" /> Plataforma de Gestión
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight leading-[1.15] text-[#F4F4F5]">
              Control absoluto de tu <br/>
              <span className="text-[#E50914]">operación de streaming.</span>
            </h1>
            
            <p className="text-[#A1A1AA] max-w-md mb-8 text-sm leading-relaxed">
              Gestión de inventario, clientes y vencimientos diseñada para profesionales. Precisión en cada dato, velocidad en cada transacción.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="bg-[#E50914] text-white px-6 py-3 rounded text-sm font-bold hover:bg-[#FF2934] transition-colors duration-150 flex items-center justify-center gap-2">
                Iniciar Operaciones <ArrowRight size={16} />
              </Link>
              <Link href="#how" className="bg-[#141418] border border-[#292930] text-[#F4F4F5] px-6 py-3 rounded text-sm font-bold hover:bg-[#1B1B21] transition-colors duration-150 flex items-center justify-center gap-2">
                <Play size={16} className="text-[#E50914]" /> Ver Flujo de Trabajo
              </Link>
            </div>
          </div>

          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-[#292930]">
            <Image src="/dashboard-img.jpg" alt="Streaming Dashboard" fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent"></div>
          </div>
        </div>

        <div className="py-4 border-b border-[#292930] bg-[#000000] overflow-hidden relative flex items-center">
          <div className="flex w-max animate-marquee gap-10 opacity-60 items-center px-6">
            {[...platforms, ...platforms].map((plat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
                <MonitorPlay size={14} /> {plat}
              </div>
            ))}
          </div>
        </div>

        <div id="features" className="grid grid-cols-1 md:grid-cols-3 border-b border-[#292930] bg-[#000000]">
          <div className="p-8 border-b md:border-b-0 md:border-r border-[#292930] hover:bg-[#0D0D10] transition-colors duration-150 group">
            <div className="bg-[#141418] w-10 h-10 rounded border border-[#292930] flex items-center justify-center mb-5 group-hover:border-[#E50914] transition-colors duration-150">
              <CheckCircle className="text-[#E50914]" size={20} />
            </div>
            <h4 className="text-sm font-bold mb-2 text-[#F4F4F5]">Boletas Automáticas</h4>
            <p className="text-[#A1A1AA] text-xs leading-relaxed">Generación instantánea de comprobantes para cada transacción.</p>
          </div>
          
          <div className="p-8 border-b md:border-b-0 md:border-r border-[#292930] hover:bg-[#0D0D10] transition-colors duration-150 group">
            <div className="bg-[#141418] w-10 h-10 rounded border border-[#292930] flex items-center justify-center mb-5 group-hover:border-[#E50914] transition-colors duration-150">
              <LinkIcon className="text-[#E50914]" size={20} />
            </div>
            <h4 className="text-sm font-bold mb-2 text-[#F4F4F5]">Links de Acceso</h4>
            <p className="text-[#A1A1AA] text-xs leading-relaxed">Enlaces únicos para la gestión autónoma de perfiles.</p>
          </div>
          
          <div className="p-8 hover:bg-[#0D0D10] transition-colors duration-150 group">
            <div className="bg-[#141418] w-10 h-10 rounded border border-[#292930] flex items-center justify-center mb-5 group-hover:border-[#E50914] transition-colors duration-150">
              <ShieldCheck className="text-[#E50914]" size={20} />
            </div>
            <h4 className="text-sm font-bold mb-2 text-[#F4F4F5]">Control de Vencimientos</h4>
            <p className="text-[#A1A1AA] text-xs leading-relaxed">Alertas precisas y cálculo automático de reembolsos.</p>
          </div>
        </div>

        <div className="bg-[#000000] p-8 md:p-12 border-b border-[#292930] grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-[#292930]">
             <Image src="/links-img.jpg" alt="Links y Gestión" fill className="object-cover opacity-80" />
          </div>
          <div>
             <h2 className="text-xl font-bold mb-4 text-[#F4F4F5]">Conexión Directa con tus Clientes</h2>
             <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">
               Genera enlaces únicos para que tus clientes accedan a sus credenciales de forma segura. Sin intermediarios, sin demoras.
             </p>
             <ul className="space-y-3">
              <li className="flex items-center gap-2 text-xs text-[#A1A1AA]"><CheckCircle size={14} className="text-[#22C55E]" /> Generación de URLs personalizadas</li>
              <li className="flex items-center gap-2 text-xs text-[#A1A1AA]"><CheckCircle size={14} className="text-[#22C55E]" /> Historial de acceso por cliente</li>
            </ul>
          </div>
        </div>

        <div id="how" className="bg-[#000000] p-8 md:p-12 border-b border-[#292930]">
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-2 text-[#F4F4F5]">Flujo Operativo</h2>
            <p className="text-[#A1A1AA] text-sm">Tres pasos diseñados para máxima eficiencia.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0D0D10] p-6 rounded border border-[#292930] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#292930]"></div>
              <div className="flex items-center justify-between mb-4">
                 <UserPlus size={20} className="text-[#A1A1AA]" />
                 <span className="text-xs font-bold text-[#292930]">01</span>
              </div>
              <h4 className="text-sm font-bold mb-2 text-[#F4F4F5]">Registro de Cliente</h4>
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed">Alta de datos y contacto en el directorio central.</p>
            </div>
            
            <div className="bg-[#0D0D10] p-6 rounded border border-[#292930] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#292930]"></div>
              <div className="flex items-center justify-between mb-4">
                 <CalendarDays size={20} className="text-[#A1A1AA]" />
                 <span className="text-xs font-bold text-[#292930]">02</span>
              </div>
              <h4 className="text-sm font-bold mb-2 text-[#F4F4F5]">Asignación de Stock</h4>
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed">Vinculación de cuenta y definición de fechas.</p>
            </div>
            
            <div className="bg-[#0D0D10] p-6 rounded border border-[#292930] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#E50914]"></div>
              <div className="flex items-center justify-between mb-4">
                 <MessageCircle size={20} className="text-[#E50914]" />
                 <span className="text-xs font-bold text-[#E50914]">03</span>
              </div>
              <h4 className="text-sm font-bold mb-2 text-[#F4F4F5]">Despacho de Credenciales</h4>
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed">Envío automatizado de datos y boleta.</p>
            </div>
          </div>
        </div>

        <div id="security" className="bg-[#000000] p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#292930] bg-[#0D0D10] px-3 py-1 rounded text-[10px] font-bold text-[#A1A1AA] mb-4 tracking-widest uppercase">
              <Lock size={12} className="text-[#E50914]" /> Entorno Seguro
            </div>
            <h2 className="text-xl font-bold mb-4 text-[#F4F4F5]">Protección de <span className="text-[#E50914]">Nivel Empresarial</span></h2>
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">
              La integridad de tu inventario y la privacidad de tus clientes son la prioridad. Arquitectura diseñada para minimizar riesgos operativos.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-xs text-[#A1A1AA]"><CheckCircle size={14} className="text-[#22C55E]" /> Acceso rápido y seguro</li>
              <li className="flex items-center gap-2 text-xs text-[#A1A1AA]"><CheckCircle size={14} className="text-[#22C55E]" /> Sin bases de datos expuestas</li>
              <li className="flex items-center gap-2 text-xs text-[#A1A1AA]"><CheckCircle size={14} className="text-[#22C55E]" /> Control absoluto de tu stock</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0D0D10] p-6 rounded border border-[#292930] text-center">
              <Server size={24} className="text-[#A1A1AA] mx-auto mb-3" />
              <h4 className="text-lg font-bold text-[#F4F4F5]">99.9%</h4>
              <p className="text-[10px] text-[#A1A1AA] uppercase font-bold mt-1 tracking-wider">Disponibilidad</p>
            </div>
            <div className="bg-[#0D0D10] p-6 rounded border border-[#292930] text-center">
              <Zap size={24} className="text-[#A1A1AA] mx-auto mb-3" />
              <h4 className="text-lg font-bold text-[#F4F4F5]">Rápido</h4>
              <p className="text-[10px] text-[#A1A1AA] uppercase font-bold mt-1 tracking-wider">Respuesta</p>
            </div>
          </div>
        </div>

        <div className="bg-[#000000] p-10 md:p-16 flex flex-col items-center justify-center border-t border-[#292930]">
          <h2 className="text-xl md:text-2xl font-bold mb-3 text-[#F4F4F5]">¿Listo para asumir el control?</h2>
          <p className="text-[#A1A1AA] text-sm mb-8 text-center max-w-md">Accede a la plataforma y comienza a operar con estándares profesionales.</p>
          
          <Link href="/dashboard" className="bg-[#E50914] text-white px-8 py-3.5 rounded text-sm font-bold hover:bg-[#FF2934] transition-colors duration-150 flex items-center gap-2">
            Acceder al Panel Ahora <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
