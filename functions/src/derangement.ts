/**
 * Secret Santa Assignment Algorithm
 * Creates a derangement where no person is assigned to themselves
 */

interface ParticipantForDraw {
  uid: string;
  displayName: string;
  email: string;
  note?: string;
}

export interface AssignmentResult {
  secretSantaUid: string;
  recipientUid: string;
  recipientName: string;
  recipientEmail: string;
  recipientNote?: string;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Creates a valid derangement (no self-assignments)
 */
export function createDerangement(
  participants: ParticipantForDraw[],
  maxAttempts: number = 100
): AssignmentResult[] {
  if (participants.length < 2) {
    throw new Error('Need at least 2 participants for Secret Santa');
  }

  let validAssignment: Map<string, string> | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffled = shuffleArray(participants);
    const assignments = new Map<string, string>();
    let isValid = true;

    // Create circular assignment: i -> (i+1) % n
    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length];

      // Check for self-assignment (should not happen with circular, but double-check)
      if (giver.uid === receiver.uid) {
        isValid = false;
        break;
      }

      assignments.set(giver.uid, receiver.uid);
    }

    if (isValid) {
      validAssignment = assignments;
      break;
    }
  }

  if (!validAssignment) {
    throw new Error('Failed to create valid assignment after maximum attempts');
  }

  // Convert to result format
  const results: AssignmentResult[] = [];
  const participantMap = new Map(participants.map(p => [p.uid, p]));

  for (const [santaUid, recipientUid] of validAssignment.entries()) {
    const recipient = participantMap.get(recipientUid);
    if (!recipient) {
      throw new Error('Recipient not found in participant list');
    }

    results.push({
      secretSantaUid: santaUid,
      recipientUid: recipient.uid,
      recipientName: recipient.displayName,
      recipientEmail: recipient.email,
      recipientNote: recipient.note,
    });
  }

  return results;
}

