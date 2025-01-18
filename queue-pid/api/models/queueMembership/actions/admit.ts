import { deleteRecord, ActionOptions } from "gadget-server";
import { admitMembershipInExternalQueue } from "../../../services/externalQueueApi";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  await deleteRecord(record);

    // Call external queue API after successful save
  try {
   
    if (record.id && record.queueId) {
      await admitMembershipInExternalQueue(record.queueId);
    }
  } catch (error) {
    logger.error({ error, membershipId: record.id }, "Failed to add membership to external queue API");
  }
};

export const options: ActionOptions = {
  actionType: "delete",
};
