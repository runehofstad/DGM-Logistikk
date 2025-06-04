export type UserRole = 'buyer' | 'seller' | 'superadmin';

export interface User {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyId?: string;
  phoneNumber?: string;
  twoFactorEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  organizationNumber: string;
  contactEmail: string;
  description: string;
  approved: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FreightRequest {
  id: string;
  companyId: string;
  userId: string;
  cargoType: string;
  weight: number;
  numberOfItems: number;
  pickupLocation: string;
  deliveryLocation: string;
  specialNeeds?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: {
    cargoType?: string;
    location?: string;
    minWeight?: number;
    maxWeight?: number;
  };
  createdAt: Date;
}