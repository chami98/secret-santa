export interface Participant {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  joinedAt: FirebaseFirestore.Timestamp;
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
  notifiedAt?: FirebaseFirestore.Timestamp;
}

export interface Event {
  id: string;
  title: string;
  organizerUid: string;
  organizerEmail: string;
  companyDomain: string;
  createdAt: FirebaseFirestore.Timestamp;
  status: 'open' | 'closed' | 'drawn';
  settings: {
    allowAnonymous: boolean;
    minParticipants: number;
    emailTemplateId?: string;
    giftBudget?: string;
    deliveryDate?: string;
  };
}

export interface DrawRequest {
  eventId: string;
}

export interface DrawResponse {
  success: boolean;
  message: string;
  assignmentCount?: number;
}

