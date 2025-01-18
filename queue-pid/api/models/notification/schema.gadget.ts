import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "notification" model, go to https://queue-pid.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "fsJRI6Df8C5y",
  comment:
    "Represents notifications sent to users regarding their status or updates in a queue.",
  fields: {
    message: {
      type: "string",
      validations: { required: true },
      storageKey: "fsJRI6Df8C5y-message",
    },
    read: {
      type: "boolean",
      default: false,
      storageKey: "fsJRI6Df8C5y-read",
    },
    user: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "user" },
      storageKey: "fsJRI6Df8C5y-user",
    },
  },
};
