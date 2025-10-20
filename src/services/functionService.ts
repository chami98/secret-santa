import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../config/firebase';
import { DrawRequest, DrawResponse } from '../types';

const functions = getFunctions(app);

/**
 * Calls the Cloud Function to perform the Secret Santa draw
 */
export const performDraw = async (eventId: string): Promise<DrawResponse> => {
  try {
    const drawFunction = httpsCallable<DrawRequest, DrawResponse>(functions, 'performDraw');
    const result = await drawFunction({ eventId });
    return result.data;
  } catch (error: any) {
    console.error('Error performing draw:', error);
    throw new Error(error.message || 'Failed to perform draw');
  }
};

