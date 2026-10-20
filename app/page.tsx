import { Zap, CheckCircle, Link as LinkIcon, UserCheck, Palette, MessageSquare, ShieldCheck, ArrowRight, Play, CreditCard, Sparkles, Tv, Users } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    { icon: CheckCircle, title: "Genera Boleta de Venta", desc: "Crea y envía comprobantes de pago automáticos a tus clientes con un solo clic." },
    { icon: LinkIcon, title: "Genera Link Propio", desc: "Crea enlaces únicos y personalizados para que cada cliente acceda a su cuenta." },
    { icon: UserCheck, title: "Cliente lleva su cuenta", desc: "Tus clientes gestionan sus propios perfiles y accesos de forma autónoma." },
    { icon: Palette, title: "Personaliza con tu Marca", desc: "Añade tu logo y colores para que la plataforma sea 100% tuya." },
    { icon: MessageSquare, title: "Personaliza tus Chats", desc: "Configura respuestas automáticas y mensajes de bienvenida por WhatsApp." },
    { icon: ShieldCheck, title: "Seguro y Confiable", desc: "Tus datos y los de tus clientes están protegidos con encriptación de alto nivel." },
  ];

  const platforms = [
    "Netflix", "Disney+", "HBO Max", "Prime Video", "Spotify", "YouTube Premium", "Crunchyroll", "Apple TV+"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500 selection:text-black">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-green-500 text-black font-bold text-xl px-2 py-1 rounded">DM</div>
            <span className="text-xl font-bold tracking-wider">GESTOR DM</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-green-500 transition">Características</a>
            <a href="#how-it-works" className="hover:text-green-500 transition">Cómo funciona</a>
            <a href="#platforms" className="hover:text-green-500 transition">Plataformas</a>
          </div>

          <Link href="/login" className="bg-green-500 text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-green-400 transition shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center px-6 pt-40 pb-20 max-w-4xl mx-auto relative">
        {/* Adorno de fondo */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 blur-[100px] rounded-full -z-10"></div>

        <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border border-green-800 animate-fade-in">
          <Sparkles size={14} /> PLATAFORMA TODO EN UNO
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
          GESTOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">DM</span>
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-300 mb-8 font-medium">
          Tu Centro de Control para Cuentas y Códigos Streaming
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
          Automatiza la gestión de tus clientes, controla accesos, genera códigos y lleva tu negocio de plataformas Streaming al siguiente nivel de forma fácil, rápida y segura.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-green-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-green-400 transition shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transform duration-200">
            ACCEDE AHORA <ArrowRight size={20} />
          </Link>
          <Link href="#how-it-works" className="inline-flex items-center justify-center gap-2 bg-[#111] border border-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition">
            <Play size={20} /> Ver cómo funciona
          </Link>
        </div>
      </section>

      {/* PLATAFORMAS (CARRUSEL VISUAL) */}
      <section id="platforms" className="py-10 border-y border-gray-800 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">Compatible con tus plataformas favoritas</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-70">
            {platforms.map((plat, i) => (
              <div key={i} className="flex items-center gap-2 text-lg font-bold text-gray-400 hover:text-white transition cursor-default">
                <Tv size={20} /> {plat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas para escalar</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">Administra y gestiona tus ventas de manera automática, trabaja en orden y profesional.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="bg-[#0f0f0f] p-8 rounded-2xl border border-gray-800 hover:border-green-500/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="bg-green-900/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-500/20 transition-all">
                <feat.icon className="text-green-500" size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">{feat.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="how-it-works" className="px-6 py-24 bg-[#0f0f0f] border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Empieza a vender en 3 simples pasos</h3>
            <p className="text-gray-400">Sin complicaciones, sin configuraciones eternas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Línea conectora (solo desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10"></div>

            {/* Paso 1 */}
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-2xl text-center relative z-10">
              <div className="w-12 h-12 bg-green-500 text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(34,197,94,0.3)]">1</div>
              <h4 className="text-lg font-bold mb-2">Registra al Cliente</h4>
              <p className="text-sm text-gray-400">Agrega el nombre y WhatsApp de tu cliente en segundos.</p>
            </div>

            {/* Paso 2 */}
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-2xl text-center relative z-10">
              <div className="w-12 h-12 bg-green-500 text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(34,197,94,0.3)]">2</div>
              <h4 className="text-lg font-bold mb-2">Asigna la Cuenta</h4>
              <p className="text-sm text-gray-400">Elige del inventario qué cuenta le vas a vender y las fechas.</p>
            </div>

            {/* Paso 3 */}
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-2xl text-center relative z-10">
              <div className="w-12 h-12 bg-green-500 text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(34,197,94,0.3)]">3</div>
              <h4 className="text-lg font-bold mb-2">Envía por WhatsApp</h4>
              <p className="text-sm text-gray-400">El sistema genera el mensaje con los datos y lo envía por WSP.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-green-900/40 to-[#0a0a0a] border border-green-500/30 p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full"></div>
          
          <Users size={48} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para profesionalizar tu negocio?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Únete a los gestores que ya están escalando sus ventas con la plataforma más completa del mercado.</p>
          <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-green-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-green-400 transition shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            Comenzar Ahora <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-gray-800 text-gray-400 font-bold text-sm px-2 py-0.5 rounded">DM</div>
          <span className="font-bold text-gray-400">Gestor DM</span>
        </div>
        <p>© {new Date().getFullYear()} Gestor DM. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="hover:text-green-500 transition">Términos y Condiciones</a>
          <a href="#" className="hover:text-green-500 transition">Privacidad</a>
          <a href="#" className="hover:text-green-500 transition">Soporte</a>
        </div>
      </footer>

    </div>
  );
}