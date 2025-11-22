import { Property, Vehicle, Subscriber, AnalyticsData, TenantApplication } from './types';
import { LayoutDashboard, Building2, Car, Wifi, Scale, BedDouble } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'rentals', label: 'Properties', icon: Building2, path: '/rentals' },
  { id: 'shortstay', label: 'Short Stay', icon: BedDouble, path: '/short-stay' },
  { id: 'fleet', label: 'Fleet Ops', icon: Car, path: '/fleet' },
  { id: 'isp', label: 'ISP Billing', icon: Wifi, path: '/isp' },
  { id: 'legal', label: 'AI Legal', icon: Scale, path: '/legal' },
];

export const ISP_PLANS = {
  Basic: { price: 50, limit: 100, label: 'Basic (100GB)' },
  Pro: { price: 120, limit: 500, label: 'Pro (500GB)' },
  Enterprise: { price: 300, limit: 2000, label: 'Enterprise (2TB)' }
};

export const MOCK_PROPERTIES: Property[] = [
  { id: 'p1', name: 'Sunset Apartments 101', type: 'LongTerm', status: 'Occupied', monthlyRevenue: 1200, tenantName: 'John Doe' },
  { id: 'p2', name: 'Downtown Loft 4B', type: 'ShortStay', status: 'Vacant', monthlyRevenue: 2400, nextCleaning: '2023-10-27' },
  { id: 'p3', name: 'Riverside Villa', type: 'LongTerm', status: 'Maintenance', monthlyRevenue: 0 },
  { id: 'p4', name: 'Cozy Cabin', type: 'ShortStay', status: 'Occupied', monthlyRevenue: 1800, nextCleaning: '2023-10-29' },
  { id: 'p5', name: 'Metro Condo', type: 'LongTerm', status: 'Occupied', monthlyRevenue: 1500, tenantName: 'Sarah Smith' },
];

export const MOCK_APPLICATIONS: TenantApplication[] = [
  { id: 'a1', name: 'Alice Walker', propertyInterest: 'p2', income: 5500, creditScore: 720, employmentStatus: 'Full-time', references: ['Previous Landlord', 'Employer'], status: 'Pending' },
  { id: 'a2', name: 'Bob Harris', propertyInterest: 'p1', income: 3000, creditScore: 580, employmentStatus: 'Contractor', references: ['Friend'], status: 'Pending' },
  { id: 'a3', name: 'Charlie Davis', propertyInterest: 'p4', income: 8000, creditScore: 750, employmentStatus: 'Self-Employed', references: ['Accountant', 'Previous Landlord'], status: 'Under Review' },
];

export const MOCK_FLEET: Vehicle[] = [
  { 
    id: 'v1', 
    model: 'Toyota HiAce', 
    plate: 'UBA 123A', 
    status: 'Active', 
    mileage: 124000, 
    driver: 'Mike K.', 
    fuelLevel: 75,
    location: { lat: 30, lng: 40, address: 'Kampala Rd, Central' },
    lastServiceDate: '2023-08-15',
    nextServiceMileage: 125000
  },
  { 
    id: 'v2', 
    model: 'Subaru Forester', 
    plate: 'UBB 456B', 
    status: 'Service', 
    mileage: 98000, 
    driver: 'Unassigned', 
    fuelLevel: 10,
    location: { lat: 60, lng: 70, address: 'Industrial Area Garage' },
    lastServiceDate: '2023-09-01',
    nextServiceMileage: 98000 // Due now
  },
  { 
    id: 'v3', 
    model: 'Toyota Corolla', 
    plate: 'UBC 789C', 
    status: 'Active', 
    mileage: 45000, 
    driver: 'Jane D.', 
    fuelLevel: 90,
    location: { lat: 45, lng: 20, address: 'Entebbe Airport Rd' },
    lastServiceDate: '2023-10-10',
    nextServiceMileage: 50000
  },
  { 
    id: 'v4', 
    model: 'Ford Ranger', 
    plate: 'UBD 101D', 
    status: 'Idle', 
    mileage: 12100, 
    driver: 'Tom H.', 
    fuelLevel: 100,
    location: { lat: 20, lng: 80, address: 'Nakawa HQ' },
    lastServiceDate: '2023-01-10', // Long time ago
    nextServiceMileage: 15000
  },
];

export const MOCK_SUBSCRIBERS: Subscriber[] = [
  { id: 's1', name: 'TechHub Uganda', plan: 'Enterprise', status: 'Active', lastPayment: '2023-10-01', usage: 450 },
  { id: 's2', name: 'Cafe Javas', plan: 'Pro', status: 'Active', lastPayment: '2023-10-05', usage: 120 },
  { id: 's3', name: 'Kampala Hospital', plan: 'Enterprise', status: 'Late', lastPayment: '2023-09-01', usage: 890 },
  { id: 's4', name: 'Res. Alice', plan: 'Basic', status: 'Churned', lastPayment: '2023-08-15', usage: 0 },
  { id: 's5', name: 'StartUp Zone', plan: 'Basic', status: 'Active', lastPayment: '2023-10-02', usage: 110 }, // Needs upgrade
];

export const MOCK_ANALYTICS: AnalyticsData[] = [
  { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
  { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
  { name: 'Mar', revenue: 2000, expenses: 9800, profit: -7800 }, // Anomaly for AI to spot
  { name: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
  { name: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
  { name: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
  { name: 'Jul', revenue: 3490, expenses: 4300, profit: -810 },
  { name: 'Aug', revenue: 5600, expenses: 2100, profit: 3500 },
];