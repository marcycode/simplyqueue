import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://queue-pid.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "signed-in": {
      storageKey: "signed-in",
      default: {
        read: true,
        action: true,
      },
      models: {
        invite: {
          read: true,
          actions: {
            create: true,
            delete: true,
            resend: true,
          },
        },
        notification: {
          read: true,
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        queue: {
          read: true,
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        queueMembership: {
          read: true,
          actions: {
            admit: true,
            create: true,
            delete: true,
            update: true,
          },
        },
        session: {
          read: true,
        },
        user: {
          read: true,
          actions: {
            changePassword: true,
            signOut: true,
            update: true,
          },
        },
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
      models: {
        queue: {
          read: {
            filter:
              "accessControl/filters/queue/unauthenticated-read.gelly",
          },
        },
        queueMembership: {
          read: true,
          actions: {
            create: true,
            delete: true,
          },
        },
        user: {
          actions: {
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signUp: true,
            verifyEmail: true,
          },
        },
      },
    },
  },
};
