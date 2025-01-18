import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "queueHistory" model, go to https://queue-pid.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "kypzUK6uAHwd",
  comment:
    "Records events or changes in a queue (e.g., user added, user served).",
  fields: {
    event: {
      type: "string",
      validations: { required: true },
      storageKey: "kypzUK6uAHwd-event",
    },
    queue: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "queue" },
      storageKey: "kypzUK6uAHwd-queue",
    },
  },
};
