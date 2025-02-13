import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "queueMembership" model, go to https://queue-pid.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "qo_73GvY_Y9G",
  comment:
    "Represents a user's association and status in a specific queue.",
  fields: {
    email: { type: "email", storageKey: "LG7R-U6Kv-nD" },
    firstName: { type: "string", storageKey: "CnhPaXIGlpGQ" },
    lastName: { type: "string", storageKey: "52VEJL9vDT4j" },
    queue: {
      type: "belongsTo",
      parent: { model: "queue" },
      storageKey: "qo_73GvY_Y9G-queue",
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "qo_73GvY_Y9G-user",
    },
    userImage: { type: "string", storageKey: "bICUd_aFbfDE" },
  },
};
