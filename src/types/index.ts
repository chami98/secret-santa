export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface EventSettings {
  allowAnonymous: boolean;
  minParticipants: number;
  emailTemplateId?: string;
  giftBudget?: string;
  deliveryDate?: string;
}

export interface Event {
  id: string;
  title: string;
  organizerUid: string;
  organizerEmail: string;
  companyDomain: string;
  createdAt: Date;
  status: 'open' | 'closed' | 'drawn';
  settings: EventSettings;
}

export interface Participant {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  joinedAt: Date;
  optOut: boolean;
  note?: string;
}

export interface Assignment {
  secretSantaUid: string;
  recipientUid: string;
  recipientName: string;
  recipientEmail: string;
  recipientNote?: string;
  notified: boolean;
  notifiedAt?: Date;
}

export interface DrawRequest {
  eventId: string;
}

export interface DrawResponse {
  success: boolean;
  message: string;
  assignmentCount?: number;
}

