import { logger } from "gadget-server";

const BASE_URL = "https://simplyqueue-production.up.railway.app";

interface QueueMember {
  id: string;
  queueId: string;
  position?: number;
  joinedAt?: string;
  memberData?: Record<string, unknown>;
}

/**
 * Adds a membership to the external queue service
 * @param queueId The ID of the queue
 * @param membershipId The ID of the membership to add
 */
export async function addMembershipToExternalQueue(queueId: string, membershipId: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/${queueId}/add/${membershipId}`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error(`Failed to add membership to external queue: ${response.statusText}`);
    }

    logger.info(
      { queueId, membershipId },
      "Successfully added membership to external queue"
    );
  } catch (error) {
    logger.error(
      { error, queueId, membershipId },
      "Failed to add membership to external queue"
    );
    // Don't rethrow the error as we don't want to fail the calling action
  }
}

/**
 * Admits the next membership from the external queue service
 * @param queueId The ID of the queue to admit from
 */
export async function admitMembershipInExternalQueue(queueId: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/${queueId}/admit`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to admit membership from external queue: ${response.statusText}`);
    }

    logger.info(
      { queueId },
      "Successfully admitted membership from external queue"
    );
  } catch (error) {
    logger.error(
      { error, queueId },
      "Failed to admit membership from external queue"
    );
    // Don't rethrow the error as we don't want to fail the calling action
  }
}

/**
 * Gets the member at the front of the queue from the external queue service
 * @param queueId The ID of the queue to check
 * @returns The member at the front of the queue, or null if there is an error or no members
 */
export async function getFrontOfQueue(queueId: string): Promise<QueueMember | null> {
  try {
    const response = await fetch(`${BASE_URL}/${queueId}/front`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to get front of queue: ${response.statusText}`);
    }

    const frontMember = await response.json() as QueueMember;

    logger.info(
      { queueId, frontMember },
      "Successfully got front of queue"
    );

    return frontMember;
  } catch (error) {
    logger.error(
      { error, queueId },
      "Failed to get front of queue"
    );
    return null;
  }
}