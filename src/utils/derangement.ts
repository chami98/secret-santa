/**
 * Secret Santa Assignment Algorithm
 * Creates a derangement where no person is assigned to themselves
 * and tries to avoid reciprocal pairs (A→B and B→A)
 */

export interface ParticipantForDraw {
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
 * Checks if an assignment creates a reciprocal pair
 */
function hasReciprocal(
  assignments: Map<string, string>,
  giver: string,
  receiver: string
): boolean {
  return assignments.get(receiver) === giver;
}

/**
 * Creates a valid derangement (no self-assignments, avoid reciprocals)
 * @param participants - List of participants
 * @param maxAttempts - Maximum number of attempts before giving up on avoiding reciprocals
 * @returns Assignment mapping
 */
export function createDerangement(
  participants: ParticipantForDraw[],
  maxAttempts: number = 100
): AssignmentResult[] {
  if (participants.length < 2) {
    throw new Error('Need at least 2 participants for Secret Santa');
  }

  let bestAssignments: Map<string, string> | null = null;
  let minReciprocals = Infinity;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffled = shuffleArray(participants);
    const assignments = new Map<string, string>();
    let reciprocalCount = 0;
    let hasNoSelfAssignment = true;

    // Create circular assignment: i -> (i+1) % n
    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length];

      // Check for self-assignment (should not happen with circular, but double-check)
      if (giver.uid === receiver.uid) {
        hasNoSelfAssignment = false;
        break;
      }

      assignments.set(giver.uid, receiver.uid);

      // Count reciprocals
      if (hasReciprocal(assignments, giver.uid, receiver.uid)) {
        reciprocalCount++;
      }
    }

    // If no self-assignments, this is a valid derangement
    if (hasNoSelfAssignment) {
      // If no reciprocals, we found the perfect assignment
      if (reciprocalCount === 0) {
        bestAssignments = assignments;
        break;
      }

      // Track the best assignment (fewest reciprocals)
      if (reciprocalCount < minReciprocals) {
        minReciprocals = reciprocalCount;
        bestAssignments = assignments;
      }
    }
  }

  if (!bestAssignments) {
    throw new Error('Failed to create valid assignment after maximum attempts');
  }

  // Convert to result format
  const results: AssignmentResult[] = [];
  const participantMap = new Map(participants.map(p => [p.uid, p]));

  for (const [santaUid, recipientUid] of bestAssignments.entries()) {
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

/**
 * Validates that assignments form a valid derangement
 */
export function validateDerangement(
  assignments: AssignmentResult[],
  participants: ParticipantForDraw[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check each person is assigned exactly once as giver
  const givers = new Set(assignments.map(a => a.secretSantaUid));
  if (givers.size !== participants.length) {
    errors.push('Not all participants have an assignment');
  }

  // Check each person is assigned exactly once as receiver
  const receivers = new Set(assignments.map(a => a.recipientUid));
  if (receivers.size !== participants.length) {
    errors.push('Not all participants are receiving a gift');
  }

  // Check for self-assignments
  for (const assignment of assignments) {
    if (assignment.secretSantaUid === assignment.recipientUid) {
      errors.push(`Self-assignment detected: ${assignment.secretSantaUid}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

