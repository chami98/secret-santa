import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { performDrawHandler } from './draw';

// Initialize Firebase Admin
admin.initializeApp();

// Export Cloud Functions
export const performDraw = functions.https.onCall(performDrawHandler);

