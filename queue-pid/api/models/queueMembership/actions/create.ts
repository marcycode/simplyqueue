import { applyParams, save, ActionOptions } from "gadget-server";
import { addMembershipToExternalQueue } from "../../../services/externalQueueApi";
 

export const run: ActionRun = async ({ params, record, logger }) => {
   
  applyParams(params, record);
  await save(record);
  
  // Call external queue API after successful save
  try {
   
    if (record.id && record.queueId) {
      await addMembershipToExternalQueue(record.queueId, record.id);
    }
  } catch (error) {
    logger.error({ error, membershipId: record.id }, "Failed to add membership to external queue API");
  }
};

export const options: ActionOptions = {
  actionType: "create",
};
