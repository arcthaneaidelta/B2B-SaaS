export type PatchCategory = 'Academic' | 'Athletic' | 'Leadership';

export type RecordType = 'Registration' | 'Order';

export interface School {
  id: string;
  name: string;
  conference: string;
  contact: string;
  contactEmail: string;
}

export interface PatchItem {
  sku: string;
  name: string;
  category: PatchCategory;
  stock: number;
  shape: 'circle' | 'shield' | 'rectangle' | 'hexagon';
  description: string;
}

export interface PatchRecord {
  id: string;
  ref: string;
  timestamp: string; // ISO 8601
  recordType: RecordType;
  student: string; // "First Name + Last Initial" or "—" for orders
  gradYear: string; // e.g. "2027" or "—"
  schoolId: string;
  schoolName: string;
  schoolConference: string;
  sportOrProgram: string;
  patchSku: string;
  patchName: string;
  patchCategory: PatchCategory;
  quantity: number;
  contactName?: string;
  contactEmail?: string;
  contactRole?: string;
  status?: 'Registered' | 'Awaiting Quote' | 'Quoted';
  notes?: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'registration' | 'order' | 'stock' | 'system';
  read: boolean;
}
