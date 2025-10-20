import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';
import { DrawRequest, DrawResponse, Event, Participant } from './types';
import { createDerangement } from './derangement';
import { sendAssignmentEmail } from './email';

const db = admin.firestore();

/**
 * Cloud Function handler for performing Secret Santa draw
 */
export async function performDrawHandler(
  data: DrawRequest,
  context: CallableContext
): Promise<DrawResponse> {
  // Validate authentication
  if (!context.auth) {
    throw new Error('Authentication required');
  }

  const { eventId } = data;
  const userId = context.auth.uid;

  if (!eventId) {
    throw new Error('Event ID is required');
  }

  try {
    // Get event
    const eventRef = db.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      throw new Error('Event not found');
    }

    const event = eventDoc.data() as Event;

    // Verify user is organizer
    if (event.organizerUid !== userId) {
      throw new Error('Only the event organizer can perform the draw');
    }

    // Check event status
    if (event.status === 'drawn') {
      throw new Error('Draw has already been performed for this event');
    }

    // Get participants
    const participantsSnapshot = await eventRef
      .collection('participants')
      .get();

    const participants: Participant[] = participantsSnapshot.docs.map(doc => 
      doc.data() as Participant
    );

    // Filter out opted-out participants
    const activeParticipants = participants.filter(p => !p.optOut);

    // Validate minimum participants
    if (activeParticipants.length < event.settings.minParticipants) {
      throw new Error(
        `Need at least ${event.settings.minParticipants} participants. Currently have ${activeParticipants.length}.`
      );
    }

    // Create assignments
    const assignments = createDerangement(
      activeParticipants.map(p => ({
        uid: p.uid,
        displayName: p.displayName,
        email: p.email,
        note: p.note,
      }))
    );

    // Save assignments to Firestore
    const batch = db.batch();

    for (const assignment of assignments) {
      const assignmentRef = eventRef
        .collection('assignments')
        .doc(assignment.secretSantaUid);

      batch.set(assignmentRef, {
        ...assignment,
        notified: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Update event status
    batch.update(eventRef, {
      status: 'drawn',
      drawnAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();

    // Send emails
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    let emailsSent = 0;
    const emailErrors: string[] = [];

    for (const assignment of assignments) {
      try {
        // Get Secret Santa's info
        const santa = activeParticipants.find(p => p.uid === assignment.secretSantaUid);
        if (!santa) continue;

        const confirmLink = `${appUrl}/event/${eventId}/assignment`;

        await sendAssignmentEmail({
          to: santa.email,
          santaName: santa.displayName,
          recipientName: assignment.recipientName,
          recipientEmail: assignment.recipientEmail,
          recipientNote: assignment.recipientNote,
          eventTitle: event.title,
          giftBudget: event.settings.giftBudget,
          deliveryDate: event.settings.deliveryDate,
          confirmLink,
        });

        // Mark as notified
        await eventRef
          .collection('assignments')
          .doc(assignment.secretSantaUid)
          .update({
            notified: true,
            notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

        emailsSent++;
      } catch (error: any) {
        console.error(`Failed to send email to ${assignment.secretSantaUid}:`, error);
        emailErrors.push(assignment.secretSantaUid);
      }
    }

    // Log audit
    await db.collection('audit').doc(eventId).collection('logs').add({
      action: 'draw_performed',
      performedBy: userId,
      participantCount: activeParticipants.length,
      assignmentCount: assignments.length,
      emailsSent,
      emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: `Draw completed successfully! ${emailsSent} emails sent.`,
      assignmentCount: assignments.length,
    };
  } catch (error: any) {
    console.error('Error performing draw:', error);
    
    // Log error
    await db.collection('audit').doc(eventId).collection('logs').add({
      action: 'draw_failed',
      performedBy: userId,
      error: error.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    throw new Error(error.message || 'Failed to perform draw');
  }
}

