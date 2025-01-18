import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "queueMembership" model, go to https://queue-pid.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "qo_73GvY_Y9G",
  comment:
    "Represents a user's association and status in a specific queue.",
  fields: {
    position: {
      type: "number",
      decimals: 0,
      validations: { required: true },
      storageKey: "qo_73GvY_Y9G-position",
    },
    queue: {
      type: "belongsTo",
      parent: { model: "queue" },
      storageKey: "qo_73GvY_Y9G-queue",
    },
    status: {
      type: "enum",
      default: "waiting",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["waiting", "served", "absent"],
      storageKey: "qo_73GvY_Y9G-status",
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "qo_73GvY_Y9G-user",
    },
  },
};
