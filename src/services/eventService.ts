import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event, EventSettings, Participant } from '../types';

/**
 * Creates a new Secret Santa event
 */
export const createEvent = async (
  title: string,
  organizerUid: string,
  organizerEmail: string,
  companyDomain: string,
  settings: EventSettings
): Promise<string> => {
  const eventData = {
    title,
    organizerUid,
    organizerEmail,
    companyDomain,
    createdAt: serverTimestamp(),
    status: 'open',
    settings,
  };

  const docRef = await addDoc(collection(db, 'events'), eventData);
  return docRef.id;
};

/**
 * Gets an event by ID
 */
export const getEvent = async (eventId: string): Promise<Event | null> => {
  const docRef = doc(db, 'events', eventId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Event;
  }

  return null;
};

/**
 * Gets all events for a user (as organizer or participant)
 */
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  // Get events where user is organizer
  const organizerQuery = query(
    collection(db, 'events'),
    where('organizerUid', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const organizerSnapshot = await getDocs(organizerQuery);
  const events: Event[] = organizerSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Event[];

  return events;
};

/**
 * Adds a participant to an event
 */
export const joinEvent = async (
  eventId: string,
  participant: Omit<Participant, 'joinedAt'>
): Promise<void> => {
  const participantData = {
    ...participant,
    joinedAt: serverTimestamp(),
  };

  const participantRef = doc(db, 'events', eventId, 'participants', participant.uid);
  await setDoc(participantRef, participantData);
};

/**
 * Gets all participants for an event
 */
export const getEventParticipants = async (eventId: string): Promise<Participant[]> => {
  const participantsRef = collection(db, 'events', eventId, 'participants');
  const q = query(participantsRef, orderBy('joinedAt', 'asc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    ...doc.data(),
    joinedAt: doc.data().joinedAt?.toDate() || new Date(),
  })) as Participant[];
};

/**
 * Gets a specific participant
 */
export const getParticipant = async (
  eventId: string,
  userId: string
): Promise<Participant | null> => {
  const participantRef = doc(db, 'events', eventId, 'participants', userId);
  const docSnap = await getDoc(participantRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      joinedAt: data.joinedAt?.toDate() || new Date(),
    } as Participant;
  }

  return null;
};

/**
 * Updates participant opt-out status
 */
export const updateParticipantOptOut = async (
  eventId: string,
  userId: string,
  optOut: boolean
): Promise<void> => {
  const participantRef = doc(db, 'events', eventId, 'participants', userId);
  await updateDoc(participantRef, { optOut });
};

/**
 * Updates participant note
 */
export const updateParticipantNote = async (
  eventId: string,
  userId: string,
  note: string
): Promise<void> => {
  const participantRef = doc(db, 'events', eventId, 'participants', userId);
  await updateDoc(participantRef, { note });
};

/**
 * Gets assignment for a user
 */
export const getMyAssignment = async (
  eventId: string,
  userId: string
): Promise<any | null> => {
  const assignmentRef = doc(db, 'events', eventId, 'assignments', userId);
  const docSnap = await getDoc(assignmentRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
};

/**
 * Updates event status
 */
export const updateEventStatus = async (
  eventId: string,
  status: 'open' | 'closed' | 'drawn'
): Promise<void> => {
  const eventRef = doc(db, 'events', eventId);
  await updateDoc(eventRef, { status });
};

