import { firebaseDB as db, firebaseAuth as auth } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot,
  query,
  where,
  Timestamp,
  serverTimestamp,
  DocumentData,
  Firestore,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { User, Pixel, TimedEvent, PowerUp } from '../types';

// Export db and auth
export { db, auth };

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PIXELS: 'pixels',
  EVENTS: 'events',
  POWERUPS: 'powerups'
} as const;

// Firestore document types
export interface FirestoreUser extends Omit<User, 'lastPixelPlacement'> {
  lastPixelPlacement: Timestamp | null;
}

export interface FirestorePixel extends Omit<Pixel, 'lastUpdated'> {
  lastUpdated: Timestamp;
}

export interface FirestoreEvent extends Omit<TimedEvent, 'startTime' | 'endTime' | 'nextOccurrence'> {
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  nextOccurrence: Timestamp | null;
}

export interface FirestorePowerUp extends Omit<PowerUp, 'startTime' | 'endTime' | 'cooldownEnd'> {
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  cooldownEnd: Timestamp | null;
}

// Helper functions to get references
export const getUserRef = (userId: string): DocumentReference => {
  if (!db) throw new Error('Firestore not initialized');
  return doc(db as Firestore, COLLECTIONS.USERS, userId);
};

export const getPixelRef = (x: number, y: number): DocumentReference => {
  if (!db) throw new Error('Firestore not initialized');
  return doc(db as Firestore, COLLECTIONS.PIXELS, `${x}-${y}`);
};

export const getEventRef = (eventId: string): DocumentReference => {
  if (!db) throw new Error('Firestore not initialized');
  return doc(db as Firestore, COLLECTIONS.EVENTS, eventId);
};

export const getPowerUpRef = (powerUpId: string): DocumentReference => {
  if (!db) throw new Error('Firestore not initialized');
  return doc(db as Firestore, COLLECTIONS.POWERUPS, powerUpId);
};

// Convert Firestore timestamps to regular dates for the frontend
export const convertFromFirestore = {
  user: (firestoreUser: FirestoreUser): User => ({
    ...firestoreUser,
    lastPixelPlacement: firestoreUser.lastPixelPlacement?.toMillis() || null,
  }),
  pixel: (firestorePixel: FirestorePixel): Pixel => ({
    ...firestorePixel,
    lastUpdated: firestorePixel.lastUpdated.toMillis(),
  }),
  event: (firestoreEvent: FirestoreEvent): TimedEvent => ({
    ...firestoreEvent,
    startTime: firestoreEvent.startTime?.toMillis() || null,
    endTime: firestoreEvent.endTime?.toMillis() || null,
    nextOccurrence: firestoreEvent.nextOccurrence?.toMillis() || null,
  }),
  powerUp: (firestorePowerUp: FirestorePowerUp): PowerUp => ({
    ...firestorePowerUp,
    startTime: firestorePowerUp.startTime?.toMillis() || null,
    endTime: firestorePowerUp.endTime?.toMillis() || null,
    cooldownEnd: firestorePowerUp.cooldownEnd?.toMillis() || null,
  }),
};

// Convert frontend dates to Firestore timestamps
export const convertToFirestore = {
  user: (user: User): FirestoreUser => ({
    ...user,
    lastPixelPlacement: user.lastPixelPlacement ? Timestamp.fromMillis(user.lastPixelPlacement) : null,
  }),
  pixel: (pixel: Pixel): FirestorePixel => ({
    ...pixel,
    lastUpdated: Timestamp.fromMillis(pixel.lastUpdated),
  }),
  event: (event: TimedEvent): FirestoreEvent => ({
    ...event,
    startTime: event.startTime ? Timestamp.fromMillis(event.startTime) : null,
    endTime: event.endTime ? Timestamp.fromMillis(event.endTime) : null,
    nextOccurrence: event.nextOccurrence ? Timestamp.fromMillis(event.nextOccurrence) : null,
  }),
  powerUp: (powerUp: PowerUp): FirestorePowerUp => ({
    ...powerUp,
    startTime: powerUp.startTime ? Timestamp.fromMillis(powerUp.startTime) : null,
    endTime: powerUp.endTime ? Timestamp.fromMillis(powerUp.endTime) : null,
    cooldownEnd: powerUp.cooldownEnd ? Timestamp.fromMillis(powerUp.cooldownEnd) : null,
  }),
};

// Re-export the Firebase instances
export { db as firebaseDB, auth as firebaseAuth }; 