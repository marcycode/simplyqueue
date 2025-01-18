import { logger } from "gadget-server";

const BASE_URL = "https://simplyqueue-production.up.railway.app";

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