"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { 
  LayoutDashboard, Tv, Users, Search, MessageCircle, AlertTriangle, 
  User, Bot, Edit, Trash2, DollarSign, RotateCcw, TrendingUp, 
  PlusCircle, PackageSearch, UserPlus, Link as LinkIcon, 
  Check, ShoppingBag, Home, Send, Menu, X, Settings
} from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import * as htmlToImage from 'html-to-image'; 
import Image from "next/image"; 

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
  const [fechaHoy, setFechaHoy] = useState("");
  
  const [modalAction, setModalAction] = useState<"renew" | "reassign" | "delete">("renew");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [msgWelcome, setMsgWelcome] = useState("🌟 *AlexStreaming - TUS CREDENCIALES* 🌟\n\nHola *{cliente}*, ¡gracias por tu compra! Aquí tienes los datos de acceso para tu cuenta de *{plataforma}*:\n\n➖➖➖➖➖➖➖➖➖➖\n📧 *Correo:* {correo}\n🔑 *Contraseña:* {password}\n👤 *Perfil:* {perfil}\n🔢 *PIN:* {pin}\n➖➖➖➖➖➖➖➖➖➖\n\n📅 *Válido hasta:* {fecha_fin}\n\nSi tienes algún problema para ingresar, respóndeme a este mensaje. ¡Disfruta tu contenido! 🎬");
  const [msgRenewal, setMsgRenewal] = useState("⚠️ *AlexStreaming - AVISO DE VENCIMIENTO* ⚠️\n\nHola *{cliente}*, te recordamos que tu suscripción a *{plataforma}* está por vencer.\n\n📅 *Fecha de vencimiento:* {fecha_fin}\n\nPara renovar por solo *S/ {costo}*, respóndeme a este mensaje. ¡Gracias!");
  const [msgExpired, setMsgExpired] = useState("🚨 *AlexStreaming - CUENTA VENCIDA* 🚨\n\nHola *{cliente}*, tu suscripción a *{plataforma}* ha vencido.\n\nPara no perder tu perfil, puedes renovar ahora por solo *S/ {costo}*.\n\n¿Deseas renovarla? Responde a este mensaje.");
  const [msgNewCredentials, setMsgNewCredentials] = useState("✅ *AlexStreaming - NUEVAS CREDENCIALES* ✅\n\nHola *{cliente}*, tus credenciales han sido actualizadas con éxito.\n\n📧 *Correo:* {correo}\n🔑 *Contraseña:* {password}\n👤 *Perfil:* {perfil}\n🔢 *PIN:* {pin}\n\n📅 *Válido hasta:* {fecha_fin}");
  const [msgReassigned, setMsgReassigned] = useState("✅ *AlexStreaming - CUENTA ASIGNADA* ✅\n\nHola *{cliente}*, se te ha asignado una nueva cuenta de *{plataforma}*.\n\n📧 *Correo:* {correo}\n🔑 *Contraseña:* {password}\n👤 *Perfil:* {perfil}\n🔢 *PIN:* {pin}\n\n📅 *Válido hasta:* {fecha_fin}");

  const [receiptData, setReceiptData] = useState<Account | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const btnNuevaCuentaRef = useRef<HTMLButtonElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFechaHoy(new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const dateActiveStart = new Date(today); dateActiveStart.setMonth(today.getMonth() - 1);
    const dateActiveEnd = new Date(today); dateActiveEnd.setMonth(today.getMonth() + 1);

    const dateWarningStart = new Date(today); dateWarningStart.setDate(today.getDate() - 28);
    const dateWarningEnd = new Date(today); dateWarningEnd.setDate(today.getDate() + 2);

    const dateExpiredStart = new Date(today); dateExpiredStart.setMonth(today.getMonth() - 3);
    const dateExpiredEnd = new Date(today); dateExpiredEnd.setMonth(today.getMonth() - 1);

    const savedAccounts = localStorage.getItem("dm_accounts_v50");
    const savedClients = localStorage.getItem("dm_clients_v50");
    const savedStock = localStorage.getItem("dm_stock_v50");

    if (savedAccounts && savedClients && savedStock) {
      setAccounts(JSON.parse(savedAccounts));
      setClients(JSON.parse(savedClients));
      setStock(JSON.parse(savedStock));
    } else {
      const defaultClients: Client[] = [
        { id: "c1", name: "Juan", phone: "51999000001" },
        { id: "c2", name: "Maria", phone: "51999000002" },
        { id: "c3", name: "Carlos", phone: "51999000003" },
        { id: "c4", name: "Ana", phone: "51999000004" },
        { id: "c5", name: "Pedro", phone: "51999000005" },
      ];

      const defaultStock: StockItem[] = [
        { id: "s1", platform: "Netflix", email: "juan@netflix.com", password: "123", profile: "P1", pin: "111", hasBot: false, basePrice: 25, status: "Asignada" },
        { id: "s2", platform: "Disney+", email: "maria@disney.com", password: "456", profile: "P2", pin: "222", hasBot: true, basePrice: 15, status: "Asignada" },
        { id: "s3", platform: "HBO Max", email: "carlos@hbo.com", password: "789", profile: "P3", pin: "333", hasBot: false, basePrice: 20, status: "Asignada" },
        { id: "s4", platform: "Prime Video", email: "ana@prime.com", password: "abc", profile: "P4", pin: "444", hasBot: false, basePrice: 10, status: "Asignada" },
        { id: "s5", platform: "Spotify", email: "pedro@spotify.com", password: "def", profile: "Familiar", pin: "555", hasBot: true, basePrice: 30, status: "Asignada" },
        { id: "s6", platform: "YouTube", email: "sin_asignar@test.com", password: "ghi", profile: "P6", pin: "666", hasBot: false, basePrice: 12, status: "Disponible" }
      ];

      const defaultAccounts: Account[] = [
        { id: "a1", clientName: "Juan", phone: "51999000001", platform: "Netflix", type: "Cuenta Completa", hasBot: false, email: "juan@netflix.com", password: "123", profile: "P1", pin: "111", startDate: formatDate(dateActiveStart), endDate: formatDate(dateActiveEnd), cost: 25 },
        { id: "a2", clientName: "Maria", phone: "51999000002", platform: "Disney+", type: "Perfil", hasBot: true, email: "maria@disney.com", password: "456", profile: "P2", pin: "222", startDate: formatDate(dateActiveStart), endDate: formatDate(dateActiveEnd), cost: 15 },
        { id: "a3", clientName: "Carlos", phone: "51999000003", platform: "HBO Max", type: "Cuenta Completa", hasBot: false, email: "carlos@hbo.com", password: "789", profile: "P3", pin: "333", startDate: formatDate(dateWarningStart), endDate: formatDate(dateWarningEnd), cost: 20 },
        { id: "a4", clientName: "Ana", phone: "51999000004", platform: "Prime Video", type: "Perfil", hasBot: false, email: "ana@prime.com", password: "abc", profile: "P4", pin: "444", startDate: formatDate(dateExpiredStart), endDate: formatDate(dateExpiredEnd), cost: 10 },
        { id: "a5", clientName: "Pedro", phone: "51999000005", platform: "Spotify", type: "Cuenta Completa", hasBot: true, email: "pedro@spotify.com", password: "def", profile: "Familiar", pin: "555", startDate: formatDate(dateActiveStart), endDate: formatDate(dateActiveEnd), cost: 30 },
        { id: "a6", clientName: "", phone: "", platform: "YouTube", type: "Perfil", hasBot: false, email: "sin_asignar@test.com", password: "ghi", profile: "P6", pin: "666", startDate: formatDate(dateActiveStart), endDate: formatDate(dateActiveEnd), cost: 12 }
      ];

      setClients(defaultClients);
      setStock(defaultStock);
      setAccounts(defaultAccounts);
      
      localStorage.setItem("dm_clients_v50", JSON.stringify(defaultClients));
      localStorage.setItem("dm_stock_v50", JSON.stringify(defaultStock));
      localStorage.setItem("dm_accounts_v50", JSON.stringify(defaultAccounts));
    }

    const savedWelcome = localStorage.getItem("dm_msg_welcome"); if (savedWelcome) setMsgWelcome(savedWelcome);
    const savedRenewal = localStorage.getItem("dm_msg_renewal"); if (savedRenewal) setMsgRenewal(savedRenewal);
    const savedExpired = localStorage.getItem("dm_msg_expired"); if (savedExpired) setMsgExpired(savedExpired);
    const savedNewCreds = localStorage.getItem("dm_msg_newcreds"); if (savedNewCreds) setMsgNewCredentials(savedNewCreds);
    const savedReassign = localStorage.getItem("dm_msg_reassign"); if (savedReassign) setMsgReassigned(savedReassign);

    const tutorialSeen = localStorage.getItem("dm_tutorial_seen_v50");
    if (!tutorialSeen) {
      setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          nextBtnText: 'Siguiente',
          prevBtnText: 'Anterior',
          doneBtnText: '¡Entendido!',
          allowClose: false,
          steps: [
            { element: btnNuevaCuentaRef.current, popover: { title: 'Paso 1: Registrar Venta', description: 'Haz clic AQUÍ para abrir el formulario. Aquí podrás asignar una cuenta a un cliente y definir las fechas de vencimiento.' } },
            { element: 'body', popover: { title: 'Paso 2: Llenar Datos', description: 'En el formulario que aparece, llena los datos del cliente (si es nuevo se guardará automáticamente), la plataforma, las credenciales y las fechas. Haz clic en "Guardar" al terminar.' } },
            { element: tableRef.current, popover: { title: 'Paso 3: Gestionar Ventas', description: 'Aquí verás todas tus ventas. Cada fila tiene botones de acción: Enviar credenciales (icono verde), Gestionar/Renovar (icono naranja para vencidas), Editar (lápiz) y Eliminar (papelera).' } },
            { element: "aside", popover: { title: 'Paso 4: Explorar Secciones', description: 'Usa este menú lateral para gestionar Clientes, ver el Inventario disponible, revisar los Productos a la venta o editar las plantillas de Mensajes de WhatsApp.' } }
          ],
          onDestroyed: () => { localStorage.setItem("dm_tutorial_seen_v50", "true"); }
        });
        driverObj.drive();
      }, 1000);
    }
  }, []);

  useEffect(() => { if (accounts.length > 0) localStorage.setItem("dm_accounts_v50", JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { if (clients.length > 0) localStorage.setItem("dm_clients_v50", JSON.stringify(clients)); }, [clients]);
  useEffect(() => { if (stock.length > 0) localStorage.setItem("dm_stock_v50", JSON.stringify(stock)); }, [stock]);
  useEffect(() => { localStorage.setItem("dm_msg_welcome", msgWelcome); }, [msgWelcome]);
  useEffect(() => { localStorage.setItem("dm_msg_renewal", msgRenewal); }, [msgRenewal]);
  useEffect(() => { localStorage.setItem("dm_msg_expired", msgExpired); }, [msgExpired]);
  useEffect(() => { localStorage.setItem("dm_msg_newcreds", msgNewCredentials); }, [msgNewCredentials]);
  useEffect(() => { localStorage.setItem("dm_msg_reassign", msgReassigned); }, [msgReassigned]);

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

  const generateMsg = (template: string, acc: Account) => {
    return template.replace(/{cliente}/g, acc.clientName).replace(/{plataforma}/g, acc.platform).replace(/{correo}/g, acc.email).replace(/{password}/g, acc.password).replace(/{perfil}/g, acc.profile).replace(/{pin}/g, acc.pin).replace(/{fecha_fin}/g, acc.endDate).replace(/{costo}/g, acc.cost.toFixed(2));
  };

  const handleSendCredentials = async (acc: Account) => {
    if (!acc.phone) return Swal.fire('Atención', 'El cliente no tiene un WhatsApp registrado.', 'warning');
    Swal.fire({ title: 'Generando Boleta...', text: 'Por favor espera...', background: '#09090B', color: '#fff', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
    setReceiptData(acc);
    setTimeout(async () => {
      try {
        if (receiptRef.current) {
          const dataUrl = await htmlToImage.toPng(receiptRef.current, { quality: 1, pixelRatio: 2 });
          const link = document.createElement('a');
          link.download = `Boleta_${acc.clientName.replace(/\s+/g, '_')}.png`;
          link.href = dataUrl;
          link.click();
          Swal.close();
          const msg = generateMsg(msgWelcome, acc);
          window.open(`https://wa.me/${acc.phone}?text=${encodeURIComponent(msg)}`, "_blank");
          setReceiptData(null);
        }
      } catch (error) {
        Swal.fire('Error', 'No se pudo generar la imagen.', 'error');
      }
    }, 500); 
  };

  const sendRenewal = (acc: Account) => {
    if (!acc.phone) return Swal.fire('Atención', 'El cliente no tiene un WhatsApp registrado.', 'warning');
    const msg = generateMsg(msgRenewal, acc);
    window.open(`https://wa.me/${acc.phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const sendExpired = (acc: Account) => {
    if (!acc.phone) return Swal.fire('Atención', 'El cliente no tiene un WhatsApp registrado.', 'warning');
    const msg = generateMsg(msgExpired, acc);
    window.open(`https://wa.me/${acc.phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const openManageModal = (account: Account) => {
    setSelectedAccount(account);
    setModalAction("renew");
    setIsModalOpen(true);

    setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        doneBtnText: '¡Entendido!',
        allowClose: false,
        steps: [
          { element: '#tab-renew', popover: { title: 'Renovar', description: 'Usa esta pestaña si el cliente pagó para extender su fecha. Puedes actualizar el correo, contraseña, perfil, PIN y la nueva fecha.' } },
          { element: '#tab-reassign', popover: { title: 'Reasignar', description: 'Usa esta pestaña si el cliente canceló. Puedes asignar la cuenta a un cliente ya registrado o escribir uno nuevo, y ponerle nueva fecha.' } },
          { element: '#tab-delete', popover: { title: 'Eliminar', description: 'Usa esta pestaña para borrar la cuenta permanentemente. Debes marcar el checkbox para confirmar.' } }
        ]
      });
      driverObj.drive();
    }, 500);
  };

  const handleSaveModal = () => {
    if (!selectedAccount) return;

    if (modalAction === "delete") {
      const confirm = (document.getElementById("confirm-delete") as HTMLInputElement)?.checked;
      if (!confirm) return alert("Debes confirmar la eliminación.");
      setAccounts(accounts.filter(a => a.id !== selectedAccount.id));
      setIsModalOpen(false);
      Swal.fire({ icon: 'success', title: 'Eliminada', background: '#09090B', color: '#fff', confirmButtonColor: '#E50914' });
    } 
    else if (modalAction === "renew") {
      const email = (document.getElementById("modal-email") as HTMLInputElement).value;
      const password = (document.getElementById("modal-pass") as HTMLInputElement).value;
      const profile = (document.getElementById("modal-profile") as HTMLInputElement).value;
      const pin = (document.getElementById("modal-pin") as HTMLInputElement).value;
      const endDate = (document.getElementById("modal-endDate") as HTMLInputElement).value;
      
      if (!endDate) return alert("La fecha es obligatoria.");

      const updated = { ...selectedAccount, email, password, profile, pin, endDate };
      setAccounts(accounts.map(a => a.id === selectedAccount.id ? updated : a));
      setIsModalOpen(false);
      
      const msg = generateMsg(msgNewCredentials, updated);
      Swal.fire({ title: '¿Enviar nuevas credenciales?', icon: 'question', showCancelButton: true, confirmButtonText: 'Sí, enviar', confirmButtonColor: '#E50914', background: '#09090B', color: '#fff' })
        .then(res => { if (res.isConfirmed) window.open(`https://wa.me/${updated.phone}?text=${encodeURIComponent(msg)}`, "_blank"); });
    } 
    else if (modalAction === "reassign") {
      const isNewClient = (document.getElementById("modal-client-type") as HTMLSelectElement).value === "new";
      let newClient, newPhone;

      if (isNewClient) {
        newClient = (document.getElementById("modal-newclient") as HTMLInputElement).value;
        newPhone = (document.getElementById("modal-newphone") as HTMLInputElement).value;
      } else {
        const selectedClientId = (document.getElementById("modal-existing-client") as HTMLSelectElement).value;
        const foundClient = clients.find(c => c.id === selectedClientId);
        newClient = foundClient?.name;
        newPhone = foundClient?.phone;
      }
      
      const newEndDate = (document.getElementById("modal-newendDate") as HTMLInputElement).value;
      
      if (!newClient || !newPhone || !newEndDate) return alert("Todos los campos son obligatorios.");

      const updated = { ...selectedAccount, clientName: newClient, phone: newPhone, endDate: newEndDate };
      setAccounts(accounts.map(a => a.id === selectedAccount.id ? updated : a));
      setIsModalOpen(false);
      
      const msg = generateMsg(msgReassigned, updated);
      Swal.fire({ title: '¿Enviar credenciales al nuevo cliente?', icon: 'question', showCancelButton: true, confirmButtonText: 'Sí, enviar', confirmButtonColor: '#E50914', background: '#09090B', color: '#fff' })
        .then(res => { if (res.isConfirmed) window.open(`https://wa.me/${updated.phone}?text=${encodeURIComponent(msg)}`, "_blank"); });
    }
  };

  const openAccountModal = async (accountToEdit?: Account) => {
    const isEdit = !!accountToEdit;
    const { value: formValues } = await Swal.fire({
      title: `<span style="color: #F4F4F5; font-size: 20px;">${isEdit ? 'Editar' : 'Registrar'} Cuenta</span>`,
      background: '#09090B', color: '#fff', width: '700px',
      html: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: left; margin-top: 15px;">
          <div style="grid-column: span 2; display: flex; gap: 12px;">
             <div style="flex: 1;"><label style="color: #A1A1AA; font-size: 12px;">Cliente (Opcional)</label><input id="swal-client" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="Ej: Juan Pérez" value="${accountToEdit?.clientName || ''}"></div>
             <div style="flex: 1;"><label style="color: #A1A1AA; font-size: 12px;">WhatsApp (Opcional)</label><input id="swal-phone" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="Ej: 51999888777" value="${accountToEdit?.phone || ''}"></div>
          </div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Plataforma</label><select id="swal-platform" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;">${['Netflix', 'Disney+', 'HBO Max', 'Prime Video', 'Spotify', 'YouTube Premium'].map(p => `<option ${accountToEdit?.platform === p ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Tipo de Venta</label><select id="swal-type" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;"><option ${accountToEdit?.type === 'Cuenta Completa' ? 'selected' : ''}>Cuenta Completa</option><option ${accountToEdit?.type === 'Perfil' ? 'selected' : ''}>Perfil</option></select></div>
          <div style="grid-column: span 2; display: flex; align-items: center; gap: 10px; background: #141418; padding: 10px; border: 1px solid #292930; border-radius: 5px;"><input type="checkbox" id="swal-hasBot" style="width: 20px; height: 20px; accent-color: #E50914;" ${accountToEdit?.hasBot ? 'checked' : ''}><label for="swal-hasBot" style="color: #F4F4F5; font-size: 14px; cursor: pointer;">¿Se entregó Bot?</label></div>
          <div style="grid-column: span 2; margin-top: 5px; border-top: 1px solid #292930; padding-top: 10px;"><label style="color: #E50914; font-size: 14px; font-weight: bold;">Credenciales</label></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Correo</label><input id="swal-email" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="correo@ejemplo.com" value="${accountToEdit?.email || ''}"></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Contraseña</label><input id="swal-pass" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="********" value="${accountToEdit?.password || ''}"></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Perfil</label><input id="swal-profile" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="Ej: Perfil 1" value="${accountToEdit?.profile || ''}"></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">PIN</label><input id="swal-pin" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="Ej: 1234" value="${accountToEdit?.pin || ''}"></div>
          <div style="grid-column: span 2; margin-top: 5px; border-top: 1px solid #292930; padding-top: 10px;"><label style="color: #E50914; font-size: 14px; font-weight: bold;">Fechas y Costo</label></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Fecha de Inicio</label><input id="swal-startDate" type="date" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" value="${accountToEdit?.startDate || ''}"></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Fecha de Vencimiento</label><input id="swal-endDate" type="date" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" value="${accountToEdit?.endDate || ''}"></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Costo Total (S/)</label><input id="swal-cost" type="number" min="0" step="0.1" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="0.00" value="${accountToEdit?.cost || ''}"></div>
        </div>
      `,
      focusConfirm: false, confirmButtonColor: '#E50914',
      confirmButtonText: `<span style="color: white; font-weight: bold;">${isEdit ? 'Actualizar' : 'Guardar'}</span>`,
      showCancelButton: true, cancelButtonText: 'Cancelar',
      didOpen: () => {
        const driverObj = driver({
          showProgress: true, nextBtnText: 'Siguiente', prevBtnText: 'Anterior', doneBtnText: '¡Entendido!', allowClose: false,
          steps: [
            { element: '#swal-client', popover: { title: 'Cliente', description: 'Escribe el nombre del cliente. Si no existe, se guardará automáticamente.' } },
            { element: '#swal-email', popover: { title: 'Credenciales', description: 'Ingresa el correo, contraseña, perfil y PIN de la cuenta.' } },
            { element: '#swal-startDate', popover: { title: 'Fechas', description: 'Selecciona la fecha de inicio y de vencimiento.' } },
            { element: '#swal-cost', popover: { title: 'Costo', description: 'Ingresa el monto total pagado por el cliente.' } }
          ]
        });
        driverObj.drive();
      },
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
      if (isEdit && accountToEdit) {
        setAccounts(accounts.map(a => a.id === accountToEdit.id ? { ...a, ...formValues } : a));
      } else {
        const newAccount = { id: Date.now().toString(), ...formValues };
        setAccounts([newAccount, ...accounts]);
        
        if (formValues.clientName && formValues.phone) {
          const clientExists = clients.find(c => c.name.toLowerCase() === formValues.clientName.toLowerCase());
          if (!clientExists) {
            setClients([...clients, { id: Date.now().toString(), name: formValues.clientName, phone: formValues.phone }]);
          }
        }
        
        const stockExists = stock.find(s => s.email === formValues.email);
        if (!stockExists) {
          setStock([...stock, { 
            id: Date.now().toString(), platform: formValues.platform, email: formValues.email, 
            password: formValues.password, profile: formValues.profile, pin: formValues.pin, 
            hasBot: formValues.hasBot, basePrice: formValues.cost, status: "Asignada" 
          }]);
        }
      }
      Swal.fire({ icon: 'success', title: 'Guardado', background: '#09090B', color: '#fff', confirmButtonColor: '#E50914', timer: 1500, showConfirmButton: false });
    }
  };

  const openStockModal = async () => {
    const { value: formValues } = await Swal.fire({
      title: `<span style="color: #F4F4F5; font-size: 20px;">Agregar al Inventario</span>`,
      background: '#09090B', color: '#fff', width: '600px',
      html: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: left; margin-top: 15px;">
          <div style="grid-column: span 2;"><label style="color: #A1A1AA; font-size: 12px;">Plataforma / Producto *</label><input id="inv-platform" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="Ej: Netflix Premium 4K"></div>
          <div style="grid-column: span 2;"><label style="color: #A1A1AA; font-size: 12px;">Correo de la Cuenta Madre *</label><input id="inv-email" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="cuenta@ejemplo.com"></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Contraseña *</label><input id="inv-pass" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="********"></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Perfil</label><input id="inv-profile" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="Ej: Perfil 3"></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">PIN</label><input id="inv-pin" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="Ej: 1234"></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">Precio Base (S/) *</label><input id="inv-price" type="number" min="0" step="0.1" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="0.00"></div>
          <div style="grid-column: span 2; display: flex; align-items: center; gap: 10px; background: #141418; padding: 10px; border: 1px solid #292930; border-radius: 5px;"><input type="checkbox" id="inv-hasBot" style="width: 20px; height: 20px; accent-color: #E50914;"><label for="inv-hasBot" style="color: #F4F4F5; font-size: 14px; cursor: pointer;">¿La cuenta incluye Bot?</label></div>
        </div>
      `,
      focusConfirm: false, confirmButtonColor: '#E50914', confirmButtonText: 'Guardar en Stock', showCancelButton: true, cancelButtonText: 'Cancelar',
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
      Swal.fire({ icon: 'success', title: 'Agregado al Stock', background: '#09090B', color: '#fff', confirmButtonColor: '#E50914', timer: 1500, showConfirmButton: false });
    }
  };

  const openAssignFromStockModal = async (stockItem: StockItem) => {
    const clientCards = clients.map(c => `
      <label style="display: block; background: #141418; border: 1px solid #292930; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; position: relative;" class="hover-card">
        <input type="radio" name="clientRadio" value="${c.id}" style="position: absolute; top: 12px; right: 12px; width: 18px; height: 18px; accent-color: #E50914;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: #1B1B21; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #A1A1AA;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
          <div><p style="color: #F4F4F5; font-weight: bold; margin: 0; font-size: 14px;">${c.name}</p><p style="color: #A1A1AA; margin: 0; font-size: 12px;">${c.phone}</p></div>
        </div>
      </label>
    `).join('');

    const { value: formValues } = await Swal.fire({
      title: `<span style="color: #F4F4F5; font-size: 20px;">Asignar Cuenta</span>`,
      background: '#09090B', color: '#fff', width: '500px',
      html: `
        <div style="text-align: left; margin-top: 15px;">
          <div style="background: #141418; border: 1px solid #292930; padding: 10px; border-radius: 8px; margin-bottom: 15px;"><p style="color: #E50914; font-size: 12px; margin: 0;">Asignando: <b>${stockItem.platform} - ${stockItem.email}</b></p></div>
          <label style="color: #A1A1AA; font-size: 12px; margin-bottom: 10px; display: block;">Selecciona al cliente:</label>
          <div style="max-height: 250px; overflow-y: auto; padding-right: 5px;">${clientCards || '<p style="color: #EF4444; font-size: 12px; text-align: center;">No tienes clientes registrados.</p>'}</div>
          <div style="margin-top: 15px; border-top: 1px solid #292930; padding-top: 15px;">
             <label style="color: #A1A1AA; font-size: 12px;">Precio final de venta (S/)</label><input id="swal-final-price" type="number" min="0" step="0.1" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" value="${stockItem.basePrice}">
             <div style="display: flex; gap: 10px; margin-top: 10px;">
                <div style="flex: 1;"><label style="color: #A1A1AA; font-size: 12px;">Fecha Inicio</label><input id="swal-start-date" type="date" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" value="${new Date().toISOString().split('T')[0]}"></div>
                <div style="flex: 1;"><label style="color: #A1A1AA; font-size: 12px;">Fecha Fin</label><input id="swal-end-date" type="date" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;"></div>
             </div>
          </div>
        </div>
      `,
      focusConfirm: false, confirmButtonColor: '#E50914', confirmButtonText: 'Confirmar y Vender', showCancelButton: true, cancelButtonText: 'Cancelar',
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
        id: Date.now().toString(), clientName: selectedClient?.name || "", phone: selectedClient?.phone || "",
        platform: stockItem.platform, type: "Cuenta Completa", hasBot: stockItem.hasBot, email: stockItem.email,
        password: stockItem.password, profile: stockItem.profile, pin: stockItem.pin, startDate: formValues.startDate,
        endDate: formValues.endDate, cost: formValues.finalPrice
      };
      setAccounts([newAccount, ...accounts]);
      setStock(stock.map(s => s.id === stockItem.id ? { ...s, status: "Asignada" } : s));
      setActiveTab("Dashboard");
      Swal.fire({ icon: 'success', title: '¡Venta Exitosa!', background: '#09090B', color: '#fff', confirmButtonColor: '#E50914' });
    }
  };

  const openAssignClientModal = async (account: Account) => {
    const clientCards = clients.map(c => `
      <label style="display: block; background: #141418; border: 1px solid #292930; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; position: relative;" class="hover-card">
        <input type="radio" name="clientRadio" value="${c.id}" style="position: absolute; top: 12px; right: 12px; width: 18px; height: 18px; accent-color: #E50914;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: #1B1B21; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #A1A1AA;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
          <div><p style="color: #F4F4F5; font-weight: bold; margin: 0; font-size: 14px;">${c.name}</p><p style="color: #A1A1AA; margin: 0; font-size: 12px;">${c.phone}</p></div>
        </div>
      </label>
    `).join('');

    const { value: formValues } = await Swal.fire({
      title: `<span style="color: #F4F4F5; font-size: 20px;">Asignar Cliente</span>`,
      background: '#09090B', color: '#fff', width: '500px',
      html: `
        <div style="text-align: left; margin-top: 15px;">
          <label style="color: #A1A1AA; font-size: 12px; margin-bottom: 10px; display: block;">Selecciona el cliente para esta cuenta:</label>
          <div style="max-height: 250px; overflow-y: auto; padding-right: 5px;">${clientCards || '<p style="color: #EF4444; font-size: 12px; text-align: center;">No tienes clientes registrados.</p>'}</div>
        </div>
      `,
      focusConfirm: false, confirmButtonColor: '#E50914', confirmButtonText: 'Asignar Cliente', showCancelButton: true, cancelButtonText: 'Cancelar',
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
        Swal.fire({ icon: 'success', title: 'Cliente Asignado', background: '#09090B', color: '#fff', confirmButtonColor: '#E50914', timer: 1500, showConfirmButton: false });
      }
    }
  };

  const openClientModal = async (clientToEdit?: Client) => {
    const isEdit = !!clientToEdit;
    const { value: formValues } = await Swal.fire({
      title: `<span style="color: #F4F4F5; font-size: 20px;">${isEdit ? 'Editar' : 'Nuevo'} Cliente</span>`,
      background: '#09090B', color: '#fff', width: '400px',
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; margin-top: 15px;">
          <div><label style="color: #A1A1AA; font-size: 12px;">Nombre Completo *</label><input id="cli-name" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="Ej: Juan Pérez" value="${clientToEdit?.name || ''}"></div>
          <div><label style="color: #A1A1AA; font-size: 12px;">WhatsApp *</label><input id="cli-phone" class="swal2-input" style="width:100%; margin:0; background: #141418; border: 1px solid #292930; color: #F4F4F5;" placeholder="Ej: 51999888777" value="${clientToEdit?.phone || ''}"></div>
        </div>
      `,
      focusConfirm: false, confirmButtonColor: '#E50914', confirmButtonText: 'Guardar', showCancelButton: true, cancelButtonText: 'Cancelar',
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
      Swal.fire({ icon: 'success', title: 'Guardado', background: '#09090B', color: '#fff', confirmButtonColor: '#E50914', timer: 1500, showConfirmButton: false });
    }
  };

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
        ::-webkit-scrollbar-track { background: #09090B; }
        ::-webkit-scrollbar-thumb { background: #292930; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #E50914; }
        .custom-scroll::-webkit-scrollbar { height: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: #0D0D10; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #292930; border-radius: 4px; border: 2px solid #0D0D10; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #E50914; }
        .hover-card:hover { border-color: #E50914 !important; background: #1B1B21 !important; }
      `}</style>

      {isModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#09090B] border border-[#292930] rounded-xl w-full max-w-md overflow-hidden">
            <div className="flex border-b border-[#292930]">
              <button id="tab-renew" onClick={() => setModalAction("renew")} className={`flex-1 py-3 text-sm font-bold ${modalAction === "renew" ? "text-[#E50914] bg-[#141418]" : "text-[#A1A1AA]"}`}>Renovar</button>
              <button id="tab-reassign" onClick={() => setModalAction("reassign")} className={`flex-1 py-3 text-sm font-bold ${modalAction === "reassign" ? "text-[#E50914] bg-[#141418]" : "text-[#A1A1AA]"}`}>Reasignar</button>
              <button id="tab-delete" onClick={() => setModalAction("delete")} className={`flex-1 py-3 text-sm font-bold ${modalAction === "delete" ? "text-[#E50914] bg-[#141418]" : "text-[#A1A1AA]"}`}>Eliminar</button>
            </div>

            <div className="p-6 space-y-4">
              {modalAction === "renew" && (
                <>
                  <div><label className="text-[11px] text-[#A1A1AA] block mb-1">Correo</label><input id="modal-email" defaultValue={selectedAccount.email} className="w-full bg-[#141418] border border-[#292930] rounded p-2 text-sm text-[#F4F4F5]" placeholder="correo@ejemplo.com"/></div>
                  <div><label className="text-[11px] text-[#A1A1AA] block mb-1">Contraseña</label><input id="modal-pass" defaultValue={selectedAccount.password} className="w-full bg-[#141418] border border-[#292930] rounded p-2 text-sm text-[#F4F4F5]" placeholder="********"/></div>
                  <div><label className="text-[11px] text-[#A1A1AA] block mb-1">Perfil</label><input id="modal-profile" defaultValue={selectedAccount.profile} className="w-full bg-[#141418] border border-[#292930] rounded p-2 text-sm text-[#F4F4F5]" placeholder="Ej: Perfil 1"/></div>
                  <div><label className="text-[11px] text-[#A1A1AA] block mb-1">PIN</label><input id="modal-pin" defaultValue={selectedAccount.pin} className="w-full bg-[#141418] border border-[#292930] rounded p-2 text-sm text-[#F4F4F5]" placeholder="Ej: 1234"/></div>
                  <div><label className="text-[11px] text-[#A1A1AA] block mb-1">Nueva Fecha Vencimiento</label><input id="modal-endDate" type="date" className="w-full bg-[#141418] border border-[#292930] rounded p-2 text-sm text-[#F4F4F5]"/></div>
                </>
              )}
              {modalAction === "reassign" && (
                <>
                  <div>
                    <label className="text-[11px] text-[#A1A1AA] block mb-1">Tipo de Cliente</label>
                    <select id="modal-client-type" className="w-full bg-[#141418] border border-[#292930] rounded p-2 text-sm text-[#F4F4F5] mb-2" onChange={(e) => {
                      const isNew = e.target.value === 'new';
                      document.getElementById('div-existing')!.style.display = isNew ? 'none' : 'block';
                      document.getElementById('div-new')!.style.display = isNew ? 'block' : 'none';
                    }}>
                      <option value="existing">Cliente Registrado</option>
                      <option value="new">Nuevo Cliente</option>
                    </select>
                  </div>
                  
                  <div id="div-existing">
                    <label className="text-[11px] text-[#A1A1AA] block mb-1">Seleccionar Cliente</label>
                    <select id="modal-existing-client" className="w-full bg-[#141418] border border-[#292930] rounded p-2 text-sm text-[#F4F4F5]">
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                    </select>
                  </div>

                  <div id="div-new" style={{ display: 'none' }}>
                    <div className="mb-2"><label className="text-[11px] text-[#A1A1AA] block mb-1">Nuevo Cliente</label><input id="modal-newclient" className="w-full bg-[#141418] border border-[#292930] rounded p-2 text-sm text-[#F4F4F5]" placeholder="Nombre del nuevo cliente"/></div>
                    <div><label className="text-[11px] text-[#A1A1AA] block mb-1">Nuevo WhatsApp</label><input id="modal-newphone" className="w-full bg-[#141418] border border-[#292930] rounded p-2 text-sm text-[#F4F4F5]" placeholder="Ej: 51999888777"/></div>
                  </div>

                  <div><label className="text-[11px] text-[#A1A1AA] block mb-1 mt-2">Nueva Fecha Vencimiento</label><input id="modal-newendDate" type="date" className="w-full bg-[#141418] border border-[#292930] rounded p-2 text-sm text-[#F4F4F5]"/></div>
                </>
              )}
              {modalAction === "delete" && (
                <div className="text-center py-4">
                  <p className="text-[#EF4444] text-sm mb-2">¿Eliminar cuenta?</p>
                  <input type="checkbox" id="confirm-delete" className="w-5 h-5 accent-[#E50914]"/>
                  <label htmlFor="confirm-delete" className="text-[#F4F4F5] text-xs ml-2">Sí, confirmar</label>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#292930] flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-[#A1A1AA] hover:text-[#F4F4F5]">Cancelar</button>
              <button onClick={handleSaveModal} className="bg-[#E50914] hover:bg-[#FF2934] text-white px-4 py-2 rounded text-xs font-bold">Guardar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={receiptRef} style={{ width: '400px', backgroundColor: '#141418', color: 'white', padding: '30px', fontFamily: 'Arial, sans-serif', border: '2px solid #292930', borderRadius: '20px' }}>
          {receiptData && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'inline-block', marginBottom: '10px' }}>
                  <Image src="/avatar.png" alt="AlexStreaming" width={60} height={60} className="rounded-lg object-cover" />
                </div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#F4F4F5' }}>AlexStreaming</h2>
                <p style={{ margin: 0, color: '#A1A1AA', fontSize: '12px' }}>Boleta de Venta Digital</p>
              </div>
              <div style={{ borderTop: '1px dashed #292930', borderBottom: '1px dashed #292930', padding: '15px 0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}><span style={{ color: '#A1A1AA' }}>Cliente:</span><span style={{ fontWeight: 'bold', color: '#F4F4F5' }}>{receiptData.clientName}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}><span style={{ color: '#A1A1AA' }}>Plataforma:</span><span style={{ fontWeight: 'bold', color: '#F4F4F5' }}>{receiptData.platform}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}><span style={{ color: '#A1A1AA' }}>Fecha Emisión:</span><span style={{ color: '#F4F4F5' }}>{new Date().toLocaleDateString('es-ES')}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span style={{ color: '#A1A1AA' }}>Válido hasta:</span><span style={{ fontWeight: 'bold', color: '#E50914' }}>{receiptData.endDate}</span></div>
              </div>
              <div style={{ backgroundColor: '#0D0D10', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '10px', color: '#E50914', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Credenciales de Acceso</p>
                <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#A1A1AA' }}>Correo:</span><span style={{ fontFamily: 'monospace', color: '#F4F4F5' }}>{receiptData.email}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#A1A1AA' }}>Contraseña:</span><span style={{ fontFamily: 'monospace', color: '#F4F4F5' }}>{receiptData.password}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#A1A1AA' }}>Perfil:</span><span style={{ fontFamily: 'monospace', color: '#F4F4F5' }}>{receiptData.profile}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#A1A1AA' }}>PIN:</span><span style={{ fontFamily: 'monospace', color: '#F4F4F5' }}>{receiptData.pin}</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1B1B21', padding: '15px', borderRadius: '10px', border: '1px solid #292930' }}>
                <span style={{ fontWeight: 'bold', color: '#E50914' }}>TOTAL PAGADO</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#F4F4F5' }}>S/ {receiptData.cost.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex min-h-screen bg-[#09090B] text-[#F4F4F5] font-sans">
        
        <aside className="w-[240px] bg-[#0D0D10] border-r border-[#292930] flex flex-col p-4 fixed h-full z-10 hidden md:flex">
          <div className="flex items-center gap-2 mb-8 px-2 mt-2">
            <div className="w-8 h-8 rounded overflow-hidden border border-[#292930]">
              <Image src="/avatar.png" alt="AlexStreaming" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-bold tracking-wide text-[#F4F4F5]">AlexStreaming</span>
          </div>
          
          <nav className="flex flex-col gap-1 text-[#A1A1AA] text-sm">
            <button onClick={() => setActiveTab("Dashboard")} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeTab === "Dashboard" ? "bg-[#1B1B21] text-[#F4F4F5] border border-[#292930]" : "hover:bg-[#141418] hover:text-[#F4F4F5]"}`}><LayoutDashboard size={18} /> Dashboard</button>
            <button onClick={() => setActiveTab("Clientes")} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeTab === "Clientes" ? "bg-[#1B1B21] text-[#F4F4F5] border border-[#292930]" : "hover:bg-[#141418] hover:text-[#F4F4F5]"}`}><Users size={18} /> Clientes</button>
            <button onClick={() => setActiveTab("Inventario")} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeTab === "Inventario" ? "bg-[#1B1B21] text-[#F4F4F5] border border-[#292930]" : "hover:bg-[#141418] hover:text-[#F4F4F5]"}`}><PackageSearch size={18} /> Inventario</button>
            <button onClick={() => setActiveTab("Productos")} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeTab === "Productos" ? "bg-[#1B1B21] text-[#F4F4F5] border border-[#292930]" : "hover:bg-[#141418] hover:text-[#F4F4F5]"}`}><ShoppingBag size={18} /> Ver Productos</button>
            <button onClick={() => setActiveTab("Vencidas")} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeTab === "Vencidas" ? "bg-[#1B1B21] text-[#F4F4F5] border border-[#292930]" : "hover:bg-[#141418] hover:text-[#F4F4F5]"}`}><AlertTriangle size={18} /> Vencidas</button>
            <button onClick={() => setActiveTab("Mensajes")} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeTab === "Mensajes" ? "bg-[#1B1B21] text-[#F4F4F5] border border-[#292930]" : "hover:bg-[#141418] hover:text-[#F4F4F5]"}`}><MessageCircle size={18} /> Mensajes WSP</button>
          </nav>

          <div className="mt-auto bg-[#141418] border border-[#292930] p-4 rounded-xl text-center">
            <h4 className="text-sm font-bold text-[#F4F4F5] mb-1">Mi Gestor de Cuentas</h4>
            <p className="text-[10px] text-[#A1A1AA] mb-3">Administra tus ventas de streaming de forma profesional.</p>
            <Link href="/" className="block w-full bg-[#E50914] hover:bg-[#FF2934] text-white text-xs font-bold py-2 rounded transition">Ir al Inicio</Link>
          </div>
        </aside>

        <div className="md:hidden fixed bottom-0 w-full bg-[#0D0D10] border-t border-[#292930] flex justify-around py-3 z-50">
          <button onClick={() => setActiveTab("Dashboard")} className={`p-2 ${activeTab === 'Dashboard' ? 'text-[#E50914]' : 'text-[#A1A1AA]'}`}><LayoutDashboard size={20}/></button>
          <button onClick={() => setActiveTab("Clientes")} className={`p-2 ${activeTab === 'Clientes' ? 'text-[#E50914]' : 'text-[#A1A1AA]'}`}><Users size={20}/></button>
          <button onClick={() => setActiveTab("Inventario")} className={`p-2 ${activeTab === 'Inventario' ? 'text-[#E50914]' : 'text-[#A1A1AA]'}`}><PackageSearch size={20}/></button>
          <button onClick={() => setActiveTab("Vencidas")} className={`p-2 ${activeTab === 'Vencidas' ? 'text-[#E50914]' : 'text-[#A1A1AA]'}`}><AlertTriangle size={20}/></button>
        </div>

        <main className="flex-1 md:ml-[240px] p-6 w-full md:w-[calc(100vw-240px)] overflow-hidden pb-20 md:pb-6">
          
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-[#F4F4F5]">{activeTab === "Dashboard" ? "Panel AlexStreaming" : activeTab}</h1>
              <p className="text-[#A1A1AA] text-sm flex items-center gap-2"><LayoutDashboard size={14}/> {activeTab}</p>
            </div>
            <div className="bg-[#141418] border border-[#292930] px-4 py-2 rounded-lg text-sm text-[#A1A1AA] hidden md:block">{fechaHoy}</div>
          </header>

          {activeTab === "Dashboard" && (
            <div className="flex flex-col xl:flex-row gap-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                <div className="bg-[#141418] border border-[#292930] p-4 rounded-xl relative overflow-hidden"><div className="absolute top-0 right-0 p-2 opacity-10"><Users size={48} className="text-[#A1A1AA]"/></div><p className="text-[#A1A1AA] text-xs mb-1 relative z-10">Ventas Activas</p><h3 className="text-3xl font-bold relative z-10 text-[#F4F4F5]">{accounts.length}</h3></div>
                <div className="bg-[#141418] border border-[#292930] p-4 rounded-xl relative overflow-hidden"><div className="absolute top-0 right-0 p-2 opacity-10"><Tv size={48} className="text-[#A1A1AA]"/></div><p className="text-[#A1A1AA] text-xs mb-1 relative z-10">Stock Disponible</p><h3 className="text-3xl font-bold text-[#22C55E] relative z-10">{stock.filter(i => i.status === 'Disponible').length}</h3></div>
                <div className="bg-[#141418] border border-[#292930] p-4 rounded-xl relative overflow-hidden"><div className="absolute top-0 right-0 p-2 opacity-10"><AlertTriangle size={48} className="text-[#A1A1AA]"/></div><p className="text-[#A1A1AA] text-xs mb-1 relative z-10">Por Vencer / Vencidas</p><h3 className="text-3xl font-bold text-[#F59E0B] relative z-10">{accounts.filter(a => ['Por Vencer', 'Vencida'].includes(getAccountData(a).status)).length}</h3></div>
                <div className="bg-[#141418] border border-[#292930] p-4 rounded-xl"><p className="text-[#A1A1AA] text-xs mb-1 text-[#22C55E] flex items-center gap-1"><DollarSign size={14}/> Ingresos Totales</p><h3 className="text-2xl font-bold text-[#22C55E]">S/ {totalIngresos.toFixed(2)}</h3></div>
                <div className="bg-[#141418] border border-[#292930] p-4 rounded-xl"><p className="text-[#A1A1AA] text-xs mb-1 text-[#F59E0B] flex items-center gap-1"><RotateCcw size={14}/> Reembolsos Prox.</p><h3 className="text-2xl font-bold text-[#F59E0B]">S/ {totalReembolsos.toFixed(2)}</h3></div>
              </div>
              <div className="bg-[#141418] border border-[#292930] p-4 rounded-xl w-full xl:w-80 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2"><h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2"><TrendingUp size={16} className="text-[#E50914]"/> Finanzas</h3></div>
                <div className="relative h-28 flex items-end justify-around border-b border-[#292930] pb-1">
                  <div className="relative w-10 h-full flex items-end"><div className="w-full bg-gradient-to-t from-[#22C55E]/20 to-[#22C55E] rounded-t-md transition-all duration-700" style={{ height: `${Math.max((totalIngresos/maxVal)*100, 5)}%` }}></div><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#22C55E]">S/ {totalIngresos.toFixed(0)}</span></div>
                  <div className="relative w-10 h-full flex items-end"><div className="w-full bg-gradient-to-t from-[#F59E0B]/20 to-[#F59E0B] rounded-t-md transition-all duration-700" style={{ height: `${Math.max((totalReembolsos/maxVal)*100, 5)}%` }}></div><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#F59E0B]">S/ {totalReembolsos.toFixed(0)}</span></div>
                </div>
                <div className="flex justify-around mt-1 text-[10px] text-[#A1A1AA]"><span>Caja</span><span>Riesgo</span></div>
              </div>
            </div>
          )}

          {(activeTab === "Dashboard" || activeTab === "Clientes" || activeTab === "Vencidas" || activeTab === "Inventario") && (
            <div className="bg-[#141418] border border-[#292930] rounded-t-xl p-3 flex justify-between items-center border-b-0">
               <div className="relative w-72"><Search className="absolute left-3 top-2 text-[#A1A1AA]" size={14} /><input type="text" placeholder="Buscar..." className="w-full bg-[#0D0D10] border border-[#292930] rounded-lg py-1.5 pl-9 pr-4 text-xs text-[#F4F4F5] focus:outline-none focus:border-[#E50914] transition" onChange={(e) => setSearchTerm(e.target.value)} /></div>
               {activeTab === "Clientes" && (<button onClick={() => openClientModal()} className="bg-[#E50914] hover:bg-[#FF2934] text-white px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1"><UserPlus size={16}/> Nuevo Cliente</button>)}
               {activeTab === "Inventario" && (<button onClick={openStockModal} className="bg-[#141418] border border-[#292930] hover:bg-[#1B1B21] text-[#F4F4F5] px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1"><PlusCircle size={16}/> Agregar al Stock</button>)}
               {(activeTab === "Dashboard" || activeTab === "Vencidas") && (<button ref={btnNuevaCuentaRef} onClick={() => openAccountModal()} className="bg-[#E50914] hover:bg-[#FF2934] text-white px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1"><PlusCircle size={16}/> Nueva Cuenta</button>)}
            </div>
          )}

          {activeTab === "Clientes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#141418] border border-[#292930] p-4 rounded-b-xl">
              {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(client => (
                <div key={client.id} className="bg-[#0D0D10] border border-[#292930] p-3 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-3"><div className="bg-[#1B1B21] h-8 w-8 rounded-full flex items-center justify-center text-[#A1A1AA]"><User size={16}/></div><div><p className="font-bold text-[#F4F4F5] text-sm">{client.name}</p><p className="text-[10px] text-[#A1A1AA]">{client.phone}</p></div></div>
                  <div className="flex gap-2"><button onClick={() => window.open(`https://wa.me/${client.phone}`, "_blank")} className="bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E] hover:text-white p-1.5 rounded-lg transition" title="Enviar WhatsApp"><MessageCircle size={16} /></button><button onClick={() => openClientModal(client)} className="bg-[#1B1B21] text-[#A1A1AA] hover:text-[#E50914] p-1.5 rounded-lg transition" title="Editar Cliente"><Edit size={16}/></button></div>
                </div>
              ))}
              {clients.length === 0 && <div className="col-span-3 text-center py-6 text-[#A1A1AA] text-sm">No hay clientes. Haz clic en "Nuevo Cliente".</div>}
            </div>
          )}

          {activeTab === "Inventario" && (
            <div className="bg-[#141418] border border-[#292930] rounded-b-xl w-full">
              <div className="overflow-x-auto custom-scroll w-full pb-2">
                <table className="w-full text-left text-sm text-[#A1A1AA] min-w-[900px]">
                  <thead className="bg-[#0D0D10] text-[#A1A1AA] uppercase border-b border-[#292930]">
                    <tr><th className="px-4 py-4 font-medium">Producto / Plataforma</th><th className="px-4 py-4 font-medium">Correo</th><th className="px-4 py-4 font-medium">Contraseña</th><th className="px-4 py-4 font-medium">Perfil / PIN</th><th className="px-4 py-4 font-medium">Precio Base</th><th className="px-4 py-4 font-medium">Bot</th><th className="px-4 py-4 font-medium">Estado</th><th className="px-4 py-4 font-medium text-center">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-[#292930]">
                    {filteredStock.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#1B1B21] transition">
                        <td className="px-4 py-4 text-[#F4F4F5] font-medium">{inv.platform}</td><td className="px-4 py-4 font-mono text-xs">{inv.email}</td><td className="px-4 py-4 font-mono text-xs">{inv.password}</td><td className="px-4 py-4 text-xs">{inv.profile} | {inv.pin}</td><td className="px-4 py-4 font-bold text-[#F4F4F5]">S/ {inv.basePrice.toFixed(2)}</td><td className="px-4 py-4">{inv.hasBot ? <span className="text-[#22C55E] text-xs font-bold">SÍ</span> : <span className="text-[#A1A1AA] text-xs">No</span>}</td>
                        <td className="px-4 py-4"><span className={`px-2 py-1 rounded text-[10px] font-bold border ${inv.status === 'Disponible' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 'bg-[#A1A1AA]/10 text-[#A1A1AA] border-[#A1A1AA]/20'}`}>{inv.status}</span></td>
                        <td className="px-4 py-4"><div className="flex gap-2 justify-center">{inv.status === 'Disponible' ? (<button onClick={() => openAssignFromStockModal(inv)} className="bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1" title="Asignar a un cliente"><LinkIcon size={14}/> Asignar</button>) : (<span className="text-[#A1A1AA] text-xs italic">Vendida</span>)}<button onClick={() => setStock(stock.filter(i => i.id !== inv.id))} className="text-[#A1A1AA] hover:text-[#E50914] transition p-1.5" title="Eliminar del inventario"><Trash2 size={16} /></button></div></td>
                      </tr>
                    ))}
                    {filteredStock.length === 0 && <tr><td colSpan={8} className="text-center py-6 text-[#A1A1AA]">No hay cuentas en el inventario.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Productos" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stock.length === 0 ? (
                <div className="col-span-3 text-center py-10 text-[#A1A1AA]">No hay productos en el inventario.</div>
              ) : (
                stock.map((prod) => (
                  <div key={prod.id} className={`bg-[#141418] border rounded-xl p-5 transition ${prod.status === 'Disponible' ? 'border-[#292930] hover:border-[#E50914]/50' : 'border-[#292930] opacity-75'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${prod.status === 'Disponible' ? 'bg-[#0D0D10] text-[#E50914]' : 'bg-[#1B1B21] text-[#A1A1AA]'}`}><Tv size={24} /></div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${prod.status === 'Disponible' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#E50914]/10 text-[#E50914]'}`}>
                        {prod.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#F4F4F5] mb-1">{prod.platform}</h3>
                    <p className="text-xs text-[#A1A1AA] mb-4">{prod.email}</p>
                    <div className="space-y-2 text-xs text-[#A1A1AA] mb-6">
                      <p className="flex justify-between"><span>Perfil:</span> <span className="text-[#F4F4F5]">{prod.profile}</span></p>
                      <p className="flex justify-between"><span>PIN:</span> <span className="text-[#F4F4F5]">{prod.pin}</span></p>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#292930] pt-4">
                      <span className="text-xl font-bold text-[#F4F4F5]">S/ {prod.basePrice.toFixed(2)}</span>
                      {prod.status === 'Disponible' ? (
                        <button onClick={() => openAssignFromStockModal(prod)} className="bg-[#E50914] hover:bg-[#FF2934] text-white px-3 py-1.5 rounded text-xs font-bold transition">Vender</button>
                      ) : (
                        <span className="text-[#A1A1AA] text-xs italic">Ya vendido</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Mensajes" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-[#141418] border border-[#292930] rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 text-[#F4F4F5]">Editor de Speech (Mensajes)</h3>
                <div className="space-y-4">
                  <div><label className="text-[11px] text-[#A1A1AA] mb-1 block">Mensaje de Bienvenida (Credenciales)</label><textarea value={msgWelcome} onChange={(e) => setMsgWelcome(e.target.value)} className="w-full bg-[#0D0D10] border border-[#292930] rounded p-3 text-xs text-[#F4F4F5] h-20 focus:outline-none focus:border-[#E50914]" placeholder="Mensaje de bienvenida..."></textarea></div>
                  <div><label className="text-[11px] text-[#A1A1AA] mb-1 block">Aviso de Vencimiento (Faltan días)</label><textarea value={msgRenewal} onChange={(e) => setMsgRenewal(e.target.value)} className="w-full bg-[#0D0D10] border border-[#292930] rounded p-3 text-xs text-[#F4F4F5] h-20 focus:outline-none focus:border-[#E50914]" placeholder="Mensaje de aviso de vencimiento..."></textarea></div>
                  <div><label className="text-[11px] text-[#A1A1AA] mb-1 block">Aviso de Cuenta Vencida (0 días)</label><textarea value={msgExpired} onChange={(e) => setMsgExpired(e.target.value)} className="w-full bg-[#0D0D10] border border-[#292930] rounded p-3 text-xs text-[#F4F4F5] h-20 focus:outline-none focus:border-[#E50914]" placeholder="Mensaje de cuenta vencida..."></textarea></div>
                  <div><label className="text-[11px] text-[#A1A1AA] mb-1 block">Mensaje de Nuevas Credenciales (Renovación)</label><textarea value={msgNewCredentials} onChange={(e) => setMsgNewCredentials(e.target.value)} className="w-full bg-[#0D0D10] border border-[#292930] rounded p-3 text-xs text-[#F4F4F5] h-20 focus:outline-none focus:border-[#E50914]" placeholder="Mensaje de nuevas credenciales..."></textarea></div>
                  <div><label className="text-[11px] text-[#A1A1AA] mb-1 block">Mensaje de Reasignación (Nuevo Cliente)</label><textarea value={msgReassigned} onChange={(e) => setMsgReassigned(e.target.value)} className="w-full bg-[#0D0D10] border border-[#292930] rounded p-3 text-xs text-[#F4F4F5] h-20 focus:outline-none focus:border-[#E50914]" placeholder="Mensaje de reasignación..."></textarea></div>
                  <button onClick={() => Swal.fire({ icon: 'success', title: 'Guardado', background: '#09090B', color: '#fff', confirmButtonColor: '#E50914', timer: 1500, showConfirmButton: false })} className="bg-[#E50914] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#FF2934] transition flex items-center gap-2"><Check size={14} /> Guardar Plantillas</button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "Dashboard" || activeTab === "Vencidas") && (
            <div ref={tableRef} className="bg-[#141418] border border-[#292930] rounded-b-xl w-full">
              <div className="overflow-x-auto custom-scroll w-full pb-2">
                <table className="w-full text-left text-sm text-[#A1A1AA] min-w-[1200px]">
                  <thead className="bg-[#0D0D10] text-[#A1A1AA] uppercase border-b border-[#292930]">
                    <tr><th className="px-4 py-4 font-medium">Cliente</th><th className="px-4 py-4 font-medium">Cuenta / Correo</th><th className="px-4 py-4 font-medium">Pass / Perfil</th><th className="px-4 py-4 font-medium text-center">Bot</th><th className="px-4 py-4 font-medium">Inicio</th><th className="px-4 py-4 font-medium">Vence</th><th className="px-4 py-4 font-medium">Días</th><th className="px-4 py-4 font-medium">Costo</th><th className="px-4 py-4 font-medium text-[#F59E0B]">Reembolso</th><th className="px-4 py-4 font-medium text-center sticky right-0 bg-[#0D0D10]">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-[#292930]">
                    {filteredAccounts.map((acc) => {
                      const { status, daysLeft, refund } = getAccountData(acc);
                      return (
                      <tr key={acc.id} className="hover:bg-[#1B1B21] transition">
                        <td className="px-4 py-4 whitespace-nowrap">{acc.clientName ? <><p className="text-[#F4F4F5] font-medium text-sm">{acc.clientName}</p><p className="text-[10px] text-[#A1A1AA]">{acc.phone}</p></> : <div className="flex flex-col gap-1"><span className="text-[#A1A1AA] text-xs italic">Sin asignar</span><button onClick={() => openAssignClientModal(acc)} className="bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E] hover:text-white px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1 w-max" title="Asignar Cliente"><LinkIcon size={10}/> Asignar Cliente</button></div>}</td>
                        <td className="px-4 py-4 whitespace-nowrap"><p className="text-[#F4F4F5] text-xs">{acc.platform}</p><p className="text-[10px] font-mono text-[#A1A1AA]">{acc.email}</p></td>
                        <td className="px-4 py-4 whitespace-nowrap"><p className="text-xs font-mono text-[#A1A1AA]">{acc.password}</p><p className="text-[10px] text-[#A1A1AA]">Perfil: {acc.profile} | PIN: {acc.pin}</p></td>
                        <td className="px-4 py-4 text-center whitespace-nowrap">{acc.hasBot ? <span className="text-[#22C55E] font-bold text-[10px] bg-[#22C55E]/10 px-2 py-1 rounded inline-flex items-center gap-1"><Bot size={12}/> SÍ</span> : <span className="text-[#A1A1AA] text-[10px]">No</span>}</td>
                        <td className="px-4 py-4 font-mono text-xs text-[#A1A1AA] whitespace-nowrap">{acc.startDate}</td><td className="px-4 py-4 font-mono text-xs text-[#A1A1AA] whitespace-nowrap">{acc.endDate}</td>
                        <td className="px-4 py-4 whitespace-nowrap"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${status === 'Activa' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : status === 'Por Vencer' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' : 'bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20'}`}>{status}</span><p className={`text-[10px] mt-1 font-bold ${status === 'Vencida' ? 'text-[#E50914]' : status === 'Por Vencer' ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>{daysLeft}</p></td>
                        <td className="px-4 py-4 font-bold text-[#F4F4F5] text-xs whitespace-nowrap">S/ {acc.cost.toFixed(2)}</td><td className="px-4 py-4 font-bold text-[#F59E0B] text-xs bg-[#F59E0B]/5 whitespace-nowrap">S/ {refund.toFixed(2)}</td>
                        <td className="px-4 py-4 sticky right-0 bg-[#141418] shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.5)]">
                          <div className="flex gap-2 justify-center">
                            {status === 'Vencida' ? (
                              <>
                                <button onClick={() => sendExpired(acc)} className="bg-[#E50914]/10 text-[#E50914] hover:bg-[#E50914] hover:text-white p-1.5 rounded transition" title="Enviar Aviso de Vencimiento"><MessageCircle size={14} /></button>
                                <button ref={btnManageRef} onClick={() => openManageModal(acc)} className="bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white p-1.5 rounded transition" title="Gestionar / Renovar"><AlertTriangle size={14} /></button>
                              </>
                            ) : (
                              <button ref={btnSendRef} onClick={() => handleSendCredentials(acc)} className="bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E] hover:text-white p-1.5 rounded transition" title="Enviar Credenciales"><MessageCircle size={14} /></button>
                            )}
                            <button onClick={() => openAccountModal(acc)} className="bg-[#1B1B21] hover:bg-[#E50914]/20 text-[#A1A1AA] hover:text-[#E50914] p-1.5 rounded transition border border-[#292930]" title="Editar Cuenta"><Edit size={14} /></button>
                            <button onClick={() => setAccounts(accounts.filter(a => a.id !== acc.id))} className="bg-[#1B1B21] hover:bg-[#E50914]/20 text-[#A1A1AA] hover:text-[#E50914] p-1.5 rounded transition border border-[#292930]" title="Eliminar Cuenta"><Trash2 size={14} /></button>
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
