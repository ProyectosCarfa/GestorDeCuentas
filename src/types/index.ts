export type AccountStatus = "disponible" | "alquilada" | "por_vencer";

export interface Account {
  id: string;
  platform: string; 
  email: string;
  profile: string;
  clientName?: string; 
  status: AccountStatus;
  startDate: string;
  endDate: string; 
  cost: number; 
  type: "venta" | "alquiler"; 
}