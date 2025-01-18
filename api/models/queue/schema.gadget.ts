import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "queue" model, go to https://queue-pid.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "bngpdb6J5Ncd",
  comment: "Represents a virtual line managed by authorized users.",
  fields: {
    createdBy: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "bngpdb6J5Ncd-createdBy",
    },
    description: {
      type: "string",
      storageKey: "bngpdb6J5Ncd-description",
    },
    name: {
      type: "string",
      validations: { required: true },
      storageKey: "bngpdb6J5Ncd-name",
    },
    queueHistories: {
      type: "hasMany",
      children: { model: "queueHistory", belongsToField: "queue" },
      storageKey: "r7dAqREJESWI",
    },
    queueMemberships: {
      type: "hasMany",
      children: { model: "queueMembership", belongsToField: "queue" },
      storageKey: "ULgXYuTR9y8S",
    },
    status: {
      type: "enum",
      default: "open",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["open", "closed"],
      storageKey: "bngpdb6J5Ncd-status",
    },
  },
};
