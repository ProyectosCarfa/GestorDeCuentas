"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { LayoutDashboard, Tv, Users, LogOut, Search, MessageCircle, AlertTriangle, User, Bot, Edit, Trash2, DollarSign, RotateCcw, TrendingUp, PlusCircle, PackageSearch, UserPlus, Link as LinkIcon, Download } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import * as htmlToImage from 'html-to-image'; 

// --- TIPOS ---
type AccountStatus = "Activa" | "Por Vencer" | "Vencida";

interface Account {
  id: string;
  clientName: string; 
  phone: string;      
  platform: string;
  type: "Cuenta Completa" | "Perfil";
  hasBot: boolean;
  email: string;
  password: string;
  profile: string;
  pin: string;
  startDate: string;
  endDate: string;
  cost: number;
}

interface Client {
  id: string;
  name: string;
  phone: string;
}

interface StockItem {
  id: string;
  platform: string;
  email: string;
  password: string;
  profile: string;
  pin: string;
  hasBot: boolean;
  basePrice: number;
  status: "Disponible" | "Asignada";
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // --- NUEVO ESTADO PARA LA FECHA ---
  const [fechaHoy, setFechaHoy] = useState("");

  // Estados para la boleta
  const [receiptData, setReceiptData] = useState<Account | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const btnNuevaCuentaRef = useRef<HTMLButtonElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedAccounts = localStorage.getItem("dm_accounts_v9");
    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));

    const savedClients = localStorage.getItem("dm_clients_v9");
    if (savedClients) setClients(JSON.parse(savedClients));

    const savedStock = localStorage.getItem("dm_stock_v9");
    if (savedStock) setStock(JSON.parse(savedStock));

    // --- ASIGNAR LA FECHA AQUÍ ---
    setFechaHoy(new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

    const tutorialSeen = localStorage.getItem("dm_tutorial_seen_v9");
    if (!tutorialSeen) {
      setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          nextBtnText: 'Siguiente',
          prevBtnText: 'Anterior',
          doneBtnText: '¡Entendido!',
          steps: [
            { 
              element: btnNuevaCuentaRef.current || undefined, 
              popover: { title: 'Paso 1: Nueva Venta', description: 'Registra una venta manual aquí.' } 
            },
            { 
              element: tableRef.current || undefined, 
              popover: { title: 'Paso 2: Control', description: 'Aquí verás tus ventas y podrás enviar boletas.' } 
            },
            { 
              element: "aside", 
              popover: { title: 'Paso 3: Menú', description: 'Gestiona clientes e inventario.' } 
            }
          ],
          onDestroyed: () => { localStorage.setItem("dm_tutorial_seen_v9", "true"); }
        });
        driverObj.drive();
      }, 1000);
    }
  }, []);

  useEffect(() => { localStorage.setItem("dm_accounts_v9", JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem("dm_clients_v9", JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem("dm_stock_v9", JSON.stringify(stock)); }, [stock]);

  // --- LÓGICA FINANCIERA ---
  const getAccountData = (account: Account) => {
    const today = new Date(); today.setHours(0,0,0,0);
    if (!account.endDate || !account.startDate) return { status: "Activa", daysLeft: "-", refund: 0 };
    
    const end = new Date(account.endDate); end.setHours(0,0,0,0);
    const start = new Date(account.startDate); start.setHours(0,0,0,0);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const pricePerDay = account.cost / totalDays;
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    let status: AccountStatus = "Activa";
    let daysLeftText = "";
    let refund = 0;

    if (diffDays < 0) { status = "Vencida"; daysLeftText = `Hace ${Math.abs(diffDays)} d.`; refund = 0; }
    else if (diffDays === 0) { status = "Por Vencer"; daysLeftText = "Vence HOY"; refund = 0; }
    else if (diffDays <= 3) { status = "Por Vencer"; daysLeftText = `${diffDays} días`; refund = Number((diffDays * pricePerDay).toFixed(2)); }
    else { daysLeftText = `${diffDays} días`; refund = Number((diffDays * pricePerDay).toFixed(2)); }

    return { status, daysLeft: daysLeftText, refund };
  };

  // --- ACCIÓN: GENERAR IMAGEN Y ENVIAR WSP ---
  const handleSendCredentials = async (acc: Account) => {
    if (!acc.phone) return Swal.fire('Atención', 'El cliente no tiene un WhatsApp registrado.', 'warning');

    Swal.fire({
      title: 'Generando Boleta...',
      text: 'Por favor espera un momento',
      background: '#0a0a0a', color: '#fff',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    setReceiptData(acc);

    setTimeout(async () => {
      try {
        if (receiptRef.current) {
          const dataUrl = await htmlToImage.toPng(receiptRef.current, { quality: 1, pixelRatio: 2 });
          
          const link = document.createElement('a');
          link.download = `Boleta_${acc.clientName.replace(/\s+/g, '_')}_${acc.platform}.png`;
          link.href = dataUrl;
          link.click();

          Swal.close();

          const msg = `🌟 *GESTOR DM - TUS CREDENCIALES* 🌟\n\nHola *${acc.clientName}*, ¡gracias por tu compra! Aquí tienes los datos de acceso para tu cuenta de *${acc.platform}*:\n\n➖➖➖➖➖➖➖➖➖➖\n📧 *Correo:* ${acc.email}\n🔑 *Contraseña:* ${acc.password}\n👤 *Perfil:* ${acc.profile}\n🔢 *PIN:* ${acc.pin}\n➖➖➖➖➖➖➖➖➖➖\n\n📅 *Válido hasta:* ${acc.endDate}\n\n_Adjunto a este mensaje te envío tu boleta de compra en imagen._ 📸\n\nSi tienes algún problema para ingresar, respóndeme a este mensaje. ¡Disfruta tu contenido! 🎬`;
          window.open(`https://wa.me/${acc.phone}?text=${encodeURIComponent(msg)}`, "_blank");

          setReceiptData(null);
        }
      } catch (error) {
        console.error("Error generando imagen:", error);
        Swal.fire('Error', 'No se pudo generar la imagen de la boleta.', 'error');
      }
    }, 500); 
  };

  const sendRenewal = (acc: Account) => {
    if (!acc.phone) return Swal.fire('Atención', 'El cliente no tiene un WhatsApp registrado.', 'warning');
    const msg = `⚠️ *GESTOR DM - AVISO DE VENCIMIENTO* ⚠️\n\nHola *${acc.clientName}*, te escribimos para recordarte que tu suscripción a *${acc.platform}* está por vencer (o ya venció).\n\n📅 *Fecha de vencimiento:* ${acc.endDate}\n\nPara que no pierdas tu perfil ni tus favoritos, puedes renovar ahora por solo *S/ ${acc.cost.toFixed(2)}*.\n\nSi deseas renovar, simplemente respóndeme a este mensaje y te enviaré los métodos de pago. ¡Gracias por tu preferencia! 🙌`;
    window.open(`https://wa.me/${acc.phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleDeleteAccount = (id: string) => {
    Swal.fire({
      title: '¿Eliminar venta?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#333',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', background: '#0a0a0a', color: '#fff'
    }).then((result) => { if (result.isConfirmed) setAccounts(accounts.filter(a => a.id !== id)); });
  };

  const handleDeleteStock = (id: string) => {
    Swal.fire({
      title: '¿Eliminar del stock?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#333',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', background: '#0a0a0a', color: '#fff'
    }).then((result) => { if (result.isConfirmed) setStock(stock.filter(s => s.id !== id)); });
  };

  // --- MODALES ---

  const openAccountModal = async (accountToEdit?: Account) => {
    const isEdit = !!accountToEdit;
    const { value: formValues } = await Swal.fire({
      title: `<span style="color: white; font-size: 20px;">${isEdit ? 'Editar' : 'Registrar'} Cuenta</span>`,
      background: '#0a0a0a', color: '#fff', width: '700px',
      html: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: left; margin-top: 15px;">
          <div style="grid-column: span 2; display: flex; gap: 12px;">
             <div style="flex: 1;"><label style="color: #9ca3af; font-size: 12px;">Cliente (Opcional)</label>
             <input id="swal-client" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="Ej: Juan Pérez" value="${accountToEdit?.clientName || ''}"></div>
             <div style="flex: 1;"><label style="color: #9ca3af; font-size: 12px;">WhatsApp (Opcional)</label>
             <input id="swal-phone" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="Ej: 51999888777" value="${accountToEdit?.phone || ''}"></div>
          </div>
          <div><label style="color: #9ca3af; font-size: 12px;">Plataforma</label>
          <select id="swal-platform" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;">
            ${['Netflix', 'Disney+', 'HBO Max', 'Prime Video', 'Spotify', 'YouTube Premium'].map(p => `<option ${accountToEdit?.platform === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select></div>
          <div><label style="color: #9ca3af; font-size: 12px;">Tipo de Venta</label>
          <select id="swal-type" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;">
            <option ${accountToEdit?.type === 'Cuenta Completa' ? 'selected' : ''}>Cuenta Completa</option>
            <option ${accountToEdit?.type === 'Perfil' ? 'selected' : ''}>Perfil</option>
          </select></div>
          <div style="grid-column: span 2; display: flex; align-items: center; gap: 10px; background: #111; padding: 10px; border: 1px solid #333; border-radius: 5px;">
             <input type="checkbox" id="swal-hasBot" style="width: 20px; height: 20px; accent-color: #84cc16;" ${accountToEdit?.hasBot ? 'checked' : ''}>
             <label for="swal-hasBot" style="color: #fff; font-size: 14px; cursor: pointer;">¿Se entregó Bot?</label>
          </div>
          <div style="grid-column: span 2; margin-top: 5px; border-top: 1px solid #333; padding-top: 10px;"><label style="color: #84cc16; font-size: 14px; font-weight: bold;">Credenciales</label></div>
          <div><label style="color: #9ca3af; font-size: 12px;">Correo</label><input id="swal-email" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="correo@ejemplo.com" value="${accountToEdit?.email || ''}"></div>
          <div><label style="color: #9ca3af; font-size: 12px;">Contraseña</label><input id="swal-pass" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="********" value="${accountToEdit?.password || ''}"></div>
          <div><label style="color: #9ca3af; font-size: 12px;">Perfil</label><input id="swal-profile" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="Ej: Perfil 1" value="${accountToEdit?.profile || ''}"></div>
          <div><label style="color: #9ca3af; font-size: 12px;">PIN</label><input id="swal-pin" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="Ej: 1234" value="${accountToEdit?.pin || ''}"></div>
          <div style="grid-column: span 2; margin-top: 5px; border-top: 1px solid #333; padding-top: 10px;"><label style="color: #84cc16; font-size: 14px; font-weight: bold;">Fechas y Costo</label></div>
          <div><label style="color: #9ca3af; font-size: 12px;">Fecha de Inicio</label><input id="swal-startDate" type="date" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" value="${accountToEdit?.startDate || ''}"></div>
          <div><label style="color: #9ca3af; font-size: 12px;">Fecha de Vencimiento</label><input id="swal-endDate" type="date" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" value="${accountToEdit?.endDate || ''}"></div>
          <div><label style="color: #9ca3af; font-size: 12px;">Costo Total (S/)</label><input id="swal-cost" type="number" min="0" step="0.1" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="0.00" value="${accountToEdit?.cost || ''}"></div>
        </div>
      `,
      focusConfirm: false, confirmButtonColor: '#84cc16',
      confirmButtonText: `<span style="color: black; font-weight: bold;">${isEdit ? 'Actualizar' : 'Guardar'}</span>`,
      showCancelButton: true, cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
        const costVal = Number(getVal("swal-cost"));
        if (costVal < 0) { Swal.showValidationMessage('El precio no puede ser negativo'); return false; }
        return {
          clientName: getVal("swal-client"), phone: getVal("swal-phone"),
          platform: getVal("swal-platform"), type: getVal("swal-type") as any,
          hasBot: (document.getElementById("swal-hasBot") as HTMLInputElement).checked,
          email: getVal("swal-email"), password: getVal("swal-pass"), 
          profile: getVal("swal-profile"), pin: getVal("swal-pin"), 
          startDate: getVal("swal-startDate"), endDate: getVal("swal-endDate"), cost: costVal
        };
      }
    });

    if (formValues) {
      if (isEdit && accountToEdit) setAccounts(accounts.map(a => a.id === accountToEdit.id ? { ...a, ...formValues } : a));
      else setAccounts([{ id: Date.now().toString(), ...formValues }, ...accounts]);
      Swal.fire({ icon: 'success', title: 'Guardado', background: '#0a0a0a', color: '#fff', confirmButtonColor: '#84cc16', timer: 1500, showConfirmButton: false });
    }
  };

  const openStockModal = async () => {
    const { value: formValues } = await Swal.fire({
      title: `<span style="color: white; font-size: 20px;">Agregar al Inventario</span>`,
      background: '#0a0a0a', color: '#fff', width: '600px',
      html: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: left; margin-top: 15px;">
          <div style="grid-column: span 2;"><label style="color: #9ca3af; font-size: 12px;">Plataforma / Producto *</label>
            <input id="inv-platform" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="Ej: Netflix Premium 4K"></div>
          <div style="grid-column: span 2;"><label style="color: #9ca3af; font-size: 12px;">Correo de la Cuenta Madre *</label>
            <input id="inv-email" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="cuenta@ejemplo.com"></div>
          <div><label style="color: #9ca3af; font-size: 12px;">Contraseña *</label><input id="inv-pass" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="********"></div>
          <div><label style="color: #9ca3af; font-size: 12px;">Perfil</label><input id="inv-profile" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="Ej: Perfil 3"></div>
          <div><label style="color: #9ca3af; font-size: 12px;">PIN</label><input id="inv-pin" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="Ej: 1234"></div>
          <div><label style="color: #9ca3af; font-size: 12px;">Precio Base (S/) *</label><input id="inv-price" type="number" min="0" step="0.1" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="0.00"></div>
          <div style="grid-column: span 2; display: flex; align-items: center; gap: 10px; background: #111; padding: 10px; border: 1px solid #333; border-radius: 5px;">
             <input type="checkbox" id="inv-hasBot" style="width: 20px; height: 20px; accent-color: #84cc16;">
             <label for="inv-hasBot" style="color: #fff; font-size: 14px; cursor: pointer;">¿La cuenta incluye Bot?</label>
          </div>
        </div>
      `,
      focusConfirm: false, confirmButtonColor: '#84cc16', confirmButtonText: 'Guardar en Stock', showCancelButton: true, cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const platform = (document.getElementById("inv-platform") as HTMLInputElement).value;
        const email = (document.getElementById("inv-email") as HTMLInputElement).value;
        const password = (document.getElementById("inv-pass") as HTMLInputElement).value;
        const price = Number((document.getElementById("inv-price") as HTMLInputElement).value);
        if (!platform || !email || !password || price <= 0) { Swal.showValidationMessage('Plataforma, correo, contraseña y precio son obligatorios'); return false; }
        return { 
          platform, email, password, basePrice: price,
          profile: (document.getElementById("inv-profile") as HTMLInputElement).value,
          pin: (document.getElementById("inv-pin") as HTMLInputElement).value,
          hasBot: (document.getElementById("inv-hasBot") as HTMLInputElement).checked
        };
      }
    });
    if (formValues) {
      setStock([{ id: Date.now().toString(), ...formValues, status: "Disponible" }, ...stock]);
      Swal.fire({ icon: 'success', title: 'Agregado al Stock', background: '#0a0a0a', color: '#fff', confirmButtonColor: '#84cc16', timer: 1500, showConfirmButton: false });
    }
  };

  const openAssignFromStockModal = async (stockItem: StockItem) => {
    const clientCards = clients.map(c => `
      <label style="display: block; background: #111; border: 1px solid #333; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; position: relative;" class="hover-card">
        <input type="radio" name="clientRadio" value="${c.id}" style="position: absolute; top: 12px; right: 12px; width: 18px; height: 18px; accent-color: #84cc16;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: #222; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #9ca3af;">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <p style="color: white; font-weight: bold; margin: 0; font-size: 14px;">${c.name}</p>
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">${c.phone}</p>
          </div>
        </div>
      </label>
    `).join('');

    const { value: formValues } = await Swal.fire({
      title: `<span style="color: white; font-size: 20px;">Asignar Cuenta</span>`,
      background: '#0a0a0a', color: '#fff', width: '500px',
      html: `
        <div style="text-align: left; margin-top: 15px;">
          <div style="background: #172214; border: 1px solid #2a4a1e; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
            <p style="color: #84cc16; font-size: 12px; margin: 0;">Asignando: <b>${stockItem.platform} - ${stockItem.email}</b></p>
          </div>
          
          <label style="color: #9ca3af; font-size: 12px; margin-bottom: 10px; display: block;">Selecciona al cliente:</label>
          <div style="max-height: 250px; overflow-y: auto; padding-right: 5px;">
            ${clientCards || '<p style="color: #ef4444; font-size: 12px; text-align: center;">No tienes clientes registrados. Ve a la pestaña Clientes primero.</p>'}
          </div>

          <div style="margin-top: 15px; border-top: 1px solid #333; padding-top: 15px;">
             <label style="color: #9ca3af; font-size: 12px;">Precio final de venta (S/)</label>
             <input id="swal-final-price" type="number" min="0" step="0.1" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" value="${stockItem.basePrice}">
             
             <div style="display: flex; gap: 10px; margin-top: 10px;">
                <div style="flex: 1;"><label style="color: #9ca3af; font-size: 12px;">Fecha Inicio</label><input id="swal-start-date" type="date" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" value="${new Date().toISOString().split('T')[0]}"></div>
                <div style="flex: 1;"><label style="color: #9ca3af; font-size: 12px;">Fecha Fin</label><input id="swal-end-date" type="date" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;"></div>
             </div>
          </div>
        </div>
      `,
      focusConfirm: false, confirmButtonColor: '#84cc16', confirmButtonText: 'Confirmar y Vender', showCancelButton: true, cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const selectedClient = document.querySelector('input[name="clientRadio"]:checked') as HTMLInputElement;
        const finalPrice = Number((document.getElementById("swal-final-price") as HTMLInputElement).value);
        const startDate = (document.getElementById("swal-start-date") as HTMLInputElement).value;
        const endDate = (document.getElementById("swal-end-date") as HTMLInputElement).value;

        if (!selectedClient) { Swal.showValidationMessage('Selecciona un cliente'); return false; }
        if (finalPrice <= 0 || !endDate) { Swal.showValidationMessage('El precio y la fecha fin son obligatorios'); return false; }

        return { clientId: selectedClient.value, finalPrice, startDate, endDate };
      }
    });

    if (formValues) {
      const selectedClient = clients.find(c => c.id === formValues.clientId);
      
      const newAccount: Account = {
        id: Date.now().toString(),
        clientName: selectedClient?.name || "",
        phone: selectedClient?.phone || "",
        platform: stockItem.platform,
        type: "Cuenta Completa",
        hasBot: stockItem.hasBot,
        email: stockItem.email,
        password: stockItem.password,
        profile: stockItem.profile,
        pin: stockItem.pin,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        cost: formValues.finalPrice
      };
      
      setAccounts([newAccount, ...accounts]);
      setStock(stock.map(s => s.id === stockItem.id ? { ...s, status: "Asignada" } : s));
      setActiveTab("Dashboard");

      Swal.fire({ icon: 'success', title: '¡Venta Exitosa!', background: '#0a0a0a', color: '#fff', confirmButtonColor: '#84cc16' });
    }
  };

  const openAssignClientModal = async (account: Account) => {
    const clientCards = clients.map(c => `
      <label style="display: block; background: #111; border: 1px solid #333; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; position: relative;" class="hover-card">
        <input type="radio" name="clientRadio" value="${c.id}" style="position: absolute; top: 12px; right: 12px; width: 18px; height: 18px; accent-color: #84cc16;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: #222; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #9ca3af;">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <p style="color: white; font-weight: bold; margin: 0; font-size: 14px;">${c.name}</p>
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">${c.phone}</p>
          </div>
        </div>
      </label>
    `).join('');

    const { value: formValues } = await Swal.fire({
      title: `<span style="color: white; font-size: 20px;">Asignar Cliente</span>`,
      background: '#0a0a0a', color: '#fff', width: '500px',
      html: `
        <div style="text-align: left; margin-top: 15px;">
          <label style="color: #9ca3af; font-size: 12px; margin-bottom: 10px; display: block;">Selecciona el cliente para esta cuenta:</label>
          <div style="max-height: 250px; overflow-y: auto; padding-right: 5px;">
            ${clientCards || '<p style="color: #ef4444; font-size: 12px; text-align: center;">No tienes clientes registrados.</p>'}
          </div>
        </div>
      `,
      focusConfirm: false, confirmButtonColor: '#84cc16', confirmButtonText: 'Asignar Cliente', showCancelButton: true, cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const selected = document.querySelector('input[name="clientRadio"]:checked') as HTMLInputElement;
        if (!selected) { Swal.showValidationMessage('Selecciona un cliente'); return false; }
        return selected.value;
      }
    });

    if (formValues) {
      const selectedClient = clients.find(c => c.id === formValues);
      if (selectedClient) {
        setAccounts(accounts.map(a => a.id === account.id ? { ...a, clientName: selectedClient.name, phone: selectedClient.phone } : a));
        Swal.fire({ icon: 'success', title: 'Cliente Asignado', background: '#0a0a0a', color: '#fff', confirmButtonColor: '#84cc16', timer: 1500, showConfirmButton: false });
      }
    }
  };

  const openClientModal = async (clientToEdit?: Client) => {
    const isEdit = !!clientToEdit;
    const { value: formValues } = await Swal.fire({
      title: `<span style="color: white; font-size: 20px;">${isEdit ? 'Editar' : 'Nuevo'} Cliente</span>`,
      background: '#0a0a0a', color: '#fff', width: '400px',
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; margin-top: 15px;">
          <div><label style="color: #9ca3af; font-size: 12px;">Nombre Completo *</label>
          <input id="cli-name" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="Ej: Juan Pérez" value="${clientToEdit?.name || ''}"></div>
          <div><label style="color: #9ca3af; font-size: 12px;">WhatsApp *</label>
          <input id="cli-phone" class="swal2-input" style="width:100%; margin:0; background: #111; border: 1px solid #333;" placeholder="Ej: 51999888777" value="${clientToEdit?.phone || ''}"></div>
        </div>
      `,
      focusConfirm: false, confirmButtonColor: '#84cc16', confirmButtonText: 'Guardar', showCancelButton: true, cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById("cli-name") as HTMLInputElement).value;
        const phone = (document.getElementById("cli-phone") as HTMLInputElement).value;
        if (!name || !phone) { Swal.showValidationMessage('Nombre y WhatsApp obligatorios'); return false; }
        return { name, phone };
      }
    });
    if (formValues) {
      if (isEdit && clientToEdit) setClients(clients.map(c => c.id === clientToEdit.id ? { ...c, ...formValues } : c));
      else setClients([{ id: Date.now().toString(), ...formValues }, ...clients]);
      Swal.fire({ icon: 'success', title: 'Guardado', background: '#0a0a0a', color: '#fff', confirmButtonColor: '#84cc16', timer: 1500, showConfirmButton: false });
    }
  };


  // --- FILTRADOS ---
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const matchSearch = acc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || acc.platform.toLowerCase().includes(searchTerm.toLowerCase()) || acc.email.toLowerCase().includes(searchTerm.toLowerCase());
      if (activeTab === "Vencidas") return matchSearch && getAccountData(acc).status === "Vencida";
      return matchSearch;
    });
  }, [accounts, searchTerm, activeTab]);

  const filteredStock = useMemo(() => {
    return stock.filter(s => s.platform.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [stock, searchTerm]);

  const totalIngresos = useMemo(() => accounts.reduce((sum, acc) => sum + acc.cost, 0), [accounts]);
  const totalReembolsos = useMemo(() => accounts.reduce((sum, acc) => sum + getAccountData(acc).refund, 0), [accounts]);
  const maxVal = Math.max(totalIngresos, totalReembolsos) || 1;

  return (
    <>
      <style jsx global>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #84cc16; }
        .custom-scroll::-webkit-scrollbar { height: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: #111; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; border: 2px solid #111; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #84cc16; }
        
        .hover-card:hover { border-color: #84cc16 !important; background: #172214 !important; }
      `}</style>

      {/* --- COMPONENTE OCULTO PARA GENERAR LA BOLETA --- */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={receiptRef} style={{ width: '400px', backgroundColor: '#0a0a0a', color: 'white', padding: '30px', fontFamily: 'Arial, sans-serif', border: '2px solid #333', borderRadius: '20px' }}>
          {receiptData && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#84cc16', color: 'black', fontWeight: 'bold', fontSize: '24px', padding: '5px 15px', borderRadius: '8px', display: 'inline-block', marginBottom: '10px' }}>DM</div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>GESTOR DM</h2>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px' }}>Boleta de Venta Digital</p>
              </div>

              <div style={{ borderTop: '1px dashed #444', borderBottom: '1px dashed #444', padding: '15px 0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                  <span style={{ color: '#9ca3af' }}>Cliente:</span>
                  <span style={{ fontWeight: 'bold' }}>{receiptData.clientName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                  <span style={{ color: '#9ca3af' }}>Plataforma:</span>
                  <span style={{ fontWeight: 'bold' }}>{receiptData.platform}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                  <span style={{ color: '#9ca3af' }}>Fecha Emisión:</span>
                  <span>{new Date().toLocaleDateString('es-ES')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#9ca3af' }}>Válido hasta:</span>
                  <span style={{ fontWeight: 'bold', color: '#84cc16' }}>{receiptData.endDate}</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '10px', color: '#84cc16', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Credenciales de Acceso</p>
                <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>Correo:</span>
                    <span style={{ fontFamily: 'monospace' }}>{receiptData.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>Contraseña:</span>
                    <span style={{ fontFamily: 'monospace' }}>{receiptData.password}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>Perfil:</span>
                    <span style={{ fontFamily: 'monospace' }}>{receiptData.profile}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>PIN:</span>
                    <span style={{ fontFamily: 'monospace' }}>{receiptData.pin}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#172214', padding: '15px', borderRadius: '10px', border: '1px solid #2a4a1e' }}>
                <span style={{ fontWeight: 'bold', color: '#84cc16' }}>TOTAL PAGADO</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>S/ {receiptData.cost.toFixed(2)}</span>
              </div>

              <p style={{ textAlign: 'center', fontSize: '10px', color: '#666', marginTop: '20px' }}>¡Gracias por tu compra! Si tienes problemas, contáctanos.</p>
            </>
          )}
        </div>
      </div>

      <div className="flex min-h-screen bg-[#050505] text-white font-sans">
        
        <aside className="w-[240px] bg-[#0a0a0a] border-r border-[#1f1f1f] flex flex-col p-4 fixed h-full z-10">
          <div className="flex items-center gap-2 mb-8 px-2 mt-2">
            <div className="bg-green-500 text-black font-extrabold text-xl px-2 py-0.5 rounded shadow-[0_0_15px_rgba(34,197,94,0.4)]">DM</div>
            <span className="text-lg font-bold tracking-wide">Gestor DM</span>
          </div>
          
          <nav className="flex flex-col gap-1 text-gray-400 text-sm">
            <button onClick={() => setActiveTab("Dashboard")} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeTab === "Dashboard" ? "bg-[#172214] text-green-500 border border-green-900/50" : "hover:bg-[#1a1a1a]"}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button onClick={() => setActiveTab("Clientes")} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeTab === "Clientes" ? "bg-[#172214] text-green-500 border border-green-900/50" : "hover:bg-[#1a1a1a]"}`}>
              <Users size={18} /> Clientes
            </button>
            <button onClick={() => setActiveTab("Inventario")} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeTab === "Inventario" ? "bg-[#172214] text-green-500 border border-green-900/50" : "hover:bg-[#1a1a1a]"}`}>
              <PackageSearch size={18} /> Inventario (Stock)
            </button>
            <button onClick={() => setActiveTab("Vencidas")} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeTab === "Vencidas" ? "bg-[#2a1717] text-red-500 border border-red-900/50" : "hover:bg-[#1a1a1a]"}`}>
              <AlertTriangle size={18} /> Vencidas
            </button>
          </nav>

          <div className="mt-auto">
             <Link href="/" className="flex items-center gap-3 text-gray-500 hover:text-red-400 px-4 py-2.5 rounded-lg transition text-sm">
              <LogOut size={18} /> Cerrar Sesión
            </Link>
          </div>
        </aside>

        <main className="flex-1 ml-[240px] p-6 w-[calc(100vw-240px)] overflow-hidden">
          
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">{activeTab === "Dashboard" ? "Panel DM" : activeTab}</h1>
              <p className="text-gray-500 text-sm flex items-center gap-2"><LayoutDashboard size={14}/> {activeTab}</p>
            </div>
            <div className="bg-[#111] border border-[#222] px-4 py-2 rounded-lg text-sm text-gray-300 hidden md:block">
              {/* --- AQUI USAMOS LA VARIABLE EN VEZ DE new Date() --- */}
              {fechaHoy}
            </div>
          </header>

          {activeTab === "Dashboard" && (
            <div className="flex flex-col xl:flex-row gap-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><Users size={48}/></div>
                  <p className="text-gray-400 text-xs mb-1 relative z-10">Ventas Activas</p>
                  <h3 className="text-3xl font-bold relative z-10">{accounts.length}</h3>
                </div>
                <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><Tv size={48}/></div>
                  <p className="text-gray-400 text-xs mb-1 relative z-10">Stock Disponible</p>
                  <h3 className="text-3xl font-bold text-blue-400 relative z-10">{stock.filter(i => i.status === 'Disponible').length}</h3>
                </div>
                <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><AlertTriangle size={48}/></div>
                  <p className="text-gray-400 text-xs mb-1 relative z-10">Por Vencer / Vencidas</p>
                  <h3 className="text-3xl font-bold text-orange-500 relative z-10">
                    {accounts.filter(a => ['Por Vencer', 'Vencida'].includes(getAccountData(a).status)).length}
                  </h3>
                </div>
                <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1 text-green-500 flex items-center gap-1"><DollarSign size={14}/> Ingresos Totales</p>
                  <h3 className="text-2xl font-bold text-green-500">S/ {totalIngresos.toFixed(2)}</h3>
                </div>
                <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1 text-orange-500 flex items-center gap-1"><RotateCcw size={14}/> Reembolsos Prox.</p>
                  <h3 className="text-2xl font-bold text-orange-500">S/ {totalReembolsos.toFixed(2)}</h3>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-xl w-full xl:w-80 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2"><TrendingUp size={16} className="text-green-500"/> Finanzas</h3>
                </div>
                <div className="relative h-28 flex items-end justify-around border-b border-[#222] pb-1">
                  <div className="relative w-10 h-full flex items-end">
                    <div className="w-full bg-gradient-to-t from-green-900/20 to-green-500 rounded-t-md transition-all duration-700" style={{ height: `${Math.max((totalIngresos/maxVal)*100, 5)}%` }}></div>
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-green-400">S/ {totalIngresos.toFixed(0)}</span>
                  </div>
                  <div className="relative w-10 h-full flex items-end">
                    <div className="w-full bg-gradient-to-t from-orange-900/20 to-orange-500 rounded-t-md transition-all duration-700" style={{ height: `${Math.max((totalReembolsos/maxVal)*100, 5)}%` }}></div>
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-orange-400">S/ {totalReembolsos.toFixed(0)}</span>
                  </div>
                </div>
                <div className="flex justify-around mt-1 text-[10px] text-gray-500"><span>Caja</span><span>Riesgo</span></div>
              </div>
            </div>
          )}

          {(activeTab === "Dashboard" || activeTab === "Clientes" || activeTab === "Vencidas" || activeTab === "Inventario") && (
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-t-xl p-3 flex justify-between items-center border-b-0">
               <div className="relative w-72">
                  <Search className="absolute left-3 top-2 text-gray-500" size={14} />
                  <input type="text" placeholder="Buscar..." className="w-full bg-[#111] border border-[#222] rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-green-500 transition" onChange={(e) => setSearchTerm(e.target.value)} />
               </div>
               
               {activeTab === "Clientes" && (
                 <button onClick={() => openClientModal()} className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                   <UserPlus size={16}/> Nuevo Cliente
                 </button>
               )}
               {activeTab === "Inventario" && (
                 <button onClick={openStockModal} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                   <PlusCircle size={16}/> Agregar al Stock
                 </button>
               )}
               {(activeTab === "Dashboard" || activeTab === "Vencidas") && (
                 <button ref={btnNuevaCuentaRef} onClick={() => openAccountModal()} className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                   <PlusCircle size={16}/> Nueva Cuenta
                 </button>
               )}
            </div>
          )}

          {activeTab === "Clientes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#0a0a0a] border border-[#1f1f1f] p-4 rounded-b-xl">
              {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(client => (
                <div key={client.id} className="bg-[#111] border border-[#222] p-3 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="bg-gray-800 h-8 w-8 rounded-full flex items-center justify-center text-gray-400"><User size={16}/></div>
                     <div><p className="font-bold text-white text-sm">{client.name}</p><p className="text-[10px] text-gray-500">{client.phone}</p></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => window.open(`https://wa.me/${client.phone}`, "_blank")} className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black p-1.5 rounded-lg transition"><MessageCircle size={16} /></button>
                    <button onClick={() => openClientModal(client)} className="bg-[#1a1a1a] text-gray-400 hover:text-blue-400 p-1.5 rounded-lg transition"><Edit size={16}/></button>
                  </div>
                </div>
              ))}
              {clients.length === 0 && <div className="col-span-3 text-center py-6 text-gray-500 text-sm">No hay clientes. Haz clic en "Nuevo Cliente".</div>}
            </div>
          )}

          {activeTab === "Inventario" && (
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-b-xl w-full">
              <div className="overflow-x-auto custom-scroll w-full pb-2">
                <table className="w-full text-left text-sm text-gray-400 min-w-[900px]">
                  <thead className="bg-[#111] text-gray-500 uppercase border-b border-[#1f1f1f]">
                    <tr>
                      <th className="px-4 py-4 font-medium">Producto / Plataforma</th>
                      <th className="px-4 py-4 font-medium">Correo</th>
                      <th className="px-4 py-4 font-medium">Contraseña</th>
                      <th className="px-4 py-4 font-medium">Perfil / PIN</th>
                      <th className="px-4 py-4 font-medium">Precio Base</th>
                      <th className="px-4 py-4 font-medium">Bot</th>
                      <th className="px-4 py-4 font-medium">Estado</th>
                      <th className="px-4 py-4 font-medium text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f1f]">
                    {filteredStock.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#151515] transition">
                        <td className="px-4 py-4 text-white font-medium">{inv.platform}</td>
                        <td className="px-4 py-4 font-mono text-xs">{inv.email}</td>
                        <td className="px-4 py-4 font-mono text-xs">{inv.password}</td>
                        <td className="px-4 py-4 text-xs">{inv.profile} | {inv.pin}</td>
                        <td className="px-4 py-4 font-bold text-white">S/ {inv.basePrice.toFixed(2)}</td>
                        <td className="px-4 py-4">
                          {inv.hasBot ? <span className="text-blue-400 text-xs font-bold">SÍ</span> : <span className="text-gray-500 text-xs">No</span>}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold border ${inv.status === 'Disponible' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2 justify-center">
                            {inv.status === 'Disponible' ? (
                              <button onClick={() => openAssignFromStockModal(inv)} className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1" title="Asignar a Cliente">
                                <LinkIcon size={14}/> Asignar
                              </button>
                            ) : (
                              <span className="text-gray-500 text-xs italic">Vendida</span>
                            )}
                            <button onClick={() => handleDeleteStock(inv.id)} className="text-gray-500 hover:text-red-500 transition p-1.5"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStock.length === 0 && <tr><td colSpan={8} className="text-center py-6 text-gray-500">No hay cuentas en el inventario.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === "Dashboard" || activeTab === "Vencidas") && (
            <div ref={tableRef} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-b-xl w-full">
              <div className="overflow-x-auto custom-scroll w-full pb-2">
                <table className="w-full text-left text-sm text-gray-400 min-w-[1200px]">
                  <thead className="bg-[#111] text-gray-500 uppercase border-b border-[#1f1f1f]">
                    <tr>
                      <th className="px-4 py-4 font-medium">Cliente</th>
                      <th className="px-4 py-4 font-medium">Cuenta / Correo</th>
                      <th className="px-4 py-4 font-medium">Pass / Perfil</th>
                      <th className="px-4 py-4 font-medium text-center">Bot</th>
                      <th className="px-4 py-4 font-medium">Inicio</th>
                      <th className="px-4 py-4 font-medium">Vence</th>
                      <th className="px-4 py-4 font-medium">Días</th>
                      <th className="px-4 py-4 font-medium">Costo</th>
                      <th className="px-4 py-4 font-medium text-orange-400">Reembolso</th>
                      <th className="px-4 py-4 font-medium text-center sticky right-0 bg-[#111]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f1f]">
                    {filteredAccounts.map((acc) => {
                      const { status, daysLeft, refund } = getAccountData(acc);
                      return (
                      <tr key={acc.id} className="hover:bg-[#151515] transition">
                        
                        <td className="px-4 py-4 whitespace-nowrap">
                          {acc.clientName ? (
                            <>
                              <p className="text-white font-medium text-sm">{acc.clientName}</p>
                              <p className="text-[10px] text-gray-500">{acc.phone}</p>
                            </>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <span className="text-gray-500 text-xs italic">Sin asignar</span>
                              <button onClick={() => openAssignClientModal(acc)} className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1 w-max">
                                <LinkIcon size={10}/> Asignar Cliente
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-white text-xs">{acc.platform}</p>
                          <p className="text-[10px] font-mono text-gray-400">{acc.email}</p>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-xs font-mono text-gray-300">{acc.password}</p>
                          <p className="text-[10px] text-gray-500">Perfil: {acc.profile} | PIN: {acc.pin}</p>
                        </td>

                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          {acc.hasBot ? <span className="text-blue-400 font-bold text-[10px] bg-blue-500/10 px-2 py-1 rounded inline-flex items-center gap-1"><Bot size={12}/> SÍ</span> : <span className="text-gray-600 text-[10px]">No</span>}
                        </td>

                        <td className="px-4 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">{acc.startDate}</td>
                        <td className="px-4 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">{acc.endDate}</td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            status === 'Activa' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                            status === 'Por Vencer' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>{status}</span>
                          <p className={`text-[10px] mt-1 font-bold ${
                            status === 'Vencida' ? 'text-red-400' : status === 'Por Vencer' ? 'text-orange-400' : 'text-green-400'
                          }`}>{daysLeft}</p>
                        </td>

                        <td className="px-4 py-4 font-bold text-white text-xs whitespace-nowrap">S/ {acc.cost.toFixed(2)}</td>

                        <td className="px-4 py-4 font-bold text-orange-400 text-xs bg-orange-500/5 whitespace-nowrap">
                          S/ {refund.toFixed(2)}
                        </td>

                        <td className="px-4 py-4 sticky right-0 bg-[#0a0a0a] shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.5)]">
                          <div className="flex gap-2 justify-center">
                            {status === 'Vencida' ? (
                              <button onClick={() => sendRenewal(acc)} className="bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-black p-1.5 rounded transition" title="Cobrar"><AlertTriangle size={14} /></button>
                            ) : (
                              <button onClick={() => handleSendCredentials(acc)} className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black p-1.5 rounded transition" title="Generar Boleta y Enviar">
                                <MessageCircle size={14} />
                              </button>
                            )}
                            <button onClick={() => openAccountModal(acc)} className="bg-[#1a1a1a] hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 p-1.5 rounded transition border border-[#222]"><Edit size={14} /></button>
                            <button onClick={() => handleDeleteAccount(acc.id)} className="bg-[#1a1a1a] hover:bg-red-500/20 text-gray-400 hover:text-red-400 p-1.5 rounded transition border border-[#222]"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
