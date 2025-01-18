import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://queue-pid.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "IcoojrVv77Op",
  fields: {
    email: {
      type: "email",
      validations: { unique: true },
      storageKey: "4dT1ndN5usI3",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "5kvvR34h6s6Q",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "d0TKlW7Z-WPA",
    },
    emailVerified: {
      type: "boolean",
      default: true,
      storageKey: "UQPXc1AEHdJ9",
    },
    firstName: { type: "string", storageKey: "TtDS-ZlOlBcE" },
    googleImageUrl: { type: "url", storageKey: "fXz6MqGgFAED" },
    googleProfileId: { type: "string", storageKey: "lZ1_YUG1xyUJ" },
    lastName: { type: "string", storageKey: "51pgAAK1WMKP" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "3p3pwN7lBC16",
    },
    notifications: {
      type: "hasMany",
      children: { model: "notification", belongsToField: "user" },
      storageKey: "dhamD1rxqQ2I",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "zQ0hgu6Epqgt",
    },
    phone: { type: "string", storageKey: "IcoojrVv77Op-phone" },
    profilePicture: {
      type: "file",
      allowPublicAccess: true,
      storageKey: "PKo9MQ5gmkFE",
    },
    queueMemberships: {
      type: "hasMany",
      children: { model: "queueMembership", belongsToField: "user" },
      storageKey: "IcoojrVv77Op-queueMemberships",
    },
    queues: {
      type: "hasMany",
      children: { model: "queue", belongsToField: "createdBy" },
      storageKey: "tLHJz9KFdqVE",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "vjpM46Bi3M-5",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "buBGH_916jUB",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "1dTUBSkP-F2F",
    },
    sessions: {
      type: "hasMany",
      children: { model: "session", belongsToField: "user" },
      storageKey: "ye9JpM92Em6I",
    },
  },
};
