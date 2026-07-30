export type ControlState = 
  | 'temp_on' 
  | 'temp_off' 
  | 'perm_upgrade' 
  | 'perm_on' 
  | 'perm_off' 
  | 'soft_delete' 
  | 'hard_delete';

export interface FeatureControl {
  id: string;
  nameEn: string;
  nameTe: string;
  state: ControlState;
}

export interface ServiceCategory {
  id: string;
  nameEn: string;
  nameTe: string;
  icon: string;
  available: boolean;
  basePrice: number;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  slot: 'morning' | 'afternoon';
  status: 'pending' | 'confirmed' | 'completed';
  customerName: string;
  customerPhone: string;
  rating?: number;
  comment?: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  descriptionEn: string;
  descriptionTe: string;
  points: number; // positive or negative
  type: 'debit' | 'credit';
}

export interface DiaryEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface WorkerKYC {
  aadhaarUploaded: boolean;
  aadhaarImage?: string;
  panUploaded: boolean;
  panImage?: string;
  verified: boolean;
  labourCardUploaded?: boolean;
  labourCardImage?: string;
  eshramCardUploaded?: boolean;
  eshramCardImage?: string;
  issueDate?: string;
  experienceYears?: number;
  idCardType?: 'bronze' | 'silver' | 'gold' | 'diamond';
  idCardNumber?: string;
  registrationNumber?: string;
}

export interface PostpaidBill {
  id: string;
  customerName: string;
  customerPhone: string;
  workDescription: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'pending' | 'paid';
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  images: string[];
  sizes: string[];
  colors: {name: string, hex: string}[];
  stock: number;
  category: string;
  rating: number;
  reviewsCount: number;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  storeName: string;
  isApproved: boolean;
  upiId?: string;
  bankAccount?: string;
  ifsc?: string;
  totalSales: number;
  commissionPaid: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface EcommerceOrder {
  id: string;
  customerId: string;
  vendorId: string;
  products: CartItem[];
  totalAmount: number;
  vendorAmount: number;
  commissionAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  paymentId?: string;
  date: string;
}
