export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  RENTALS = 'RENTALS',
  SHORT_STAY = 'SHORT_STAY',
  FLEET = 'FLEET',
  ISP = 'ISP',
  LEGAL_AI = 'LEGAL_AI'
}

export interface Property {
  id: string;
  name: string;
  type: 'LongTerm' | 'ShortStay';
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  monthlyRevenue: number;
  tenantName?: string;
  nextCleaning?: string;
}

export interface TenantApplication {
  id: string;
  name: string;
  propertyInterest: string; // ID of property
  income: number;
  creditScore: number; // Simulated
  employmentStatus: string;
  references: string[];
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
}

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  status: 'Active' | 'Service' | 'Idle';
  mileage: number;
  driver: string;
  fuelLevel: number;
  location: { lat: number; lng: number; address: string };
  lastServiceDate: string;
  nextServiceMileage: number;
}

export interface Subscriber {
  id: string;
  name: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Late' | 'Churned';
  lastPayment: string;
  usage: number; // GB
}

export interface AnalyticsData {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}