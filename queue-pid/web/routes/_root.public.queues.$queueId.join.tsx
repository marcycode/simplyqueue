import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Text, Banner } from "@shopify/polaris";
import { useAuth, useUser } from "@gadgetinc/react";
import { AutoForm } from "@gadgetinc/react/auto/polaris";
import { api } from "../api";

export async function loader({ context, params }: LoaderFunctionArgs) {
  try {
    const queue = await context.api.queue.findOne(params.queueId!, {
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (queue.status === "closed") {
      throw json(
        { error: "This queue is currently closed" },
        { status: 403 }
      );
    }

    return json({ queue });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Queue not found";
    throw json({ error: message }, { status: 404 });
  }
}

export default function JoinQueueRoute() {
  const { queue } = useLoaderData<typeof loader>();
  const { isSignedIn } = useAuth();
  const user = useUser();

  const handleJoinQueue = async (fields: any) => {
    try {
      if (isSignedIn && user) {
        // Authenticated user - just create membership
        await api.queueMembership.create({
          queue: { _link: queue.id },
          user: { _link: user.id },
        });
      } else {
        // Unauthenticated - create membership directly
        await api.queueMembership.create({
          queue: { _link: queue.id },
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
        });
      }
      return { success: true };
    } catch (error) {
      console.error("Error joining queue:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to join queue",
      };
    }
  };

  return (
    <Page title={`Join ${queue.name}`}>
      <Layout>
        <Layout.Section>
          <Card>
            {isSignedIn ? (
              <>
                <Text as="p" variant="bodyMd">
                  Click below to join {queue.name} as {user?.firstName}{" "}
                  {user?.lastName}.
                </Text>
                <AutoForm
                  onSubmit={handleJoinQueue}
                  submitActionText="Join Queue"
                  successMessage="Successfully joined the queue! Please check your email for confirmation."
                />
              </>
            ) : (
              <AutoForm
                fields={["firstName", "lastName", "email", "userImage"]}
                validates={{
                  firstName: { required: true },
                  lastName: { required: true },
                  email: { required: true, email: true },
                  userImage: { required: false },
                }}
                onSubmit={handleJoinQueue}
                submitActionText="Join Queue"
                successMessage="Successfully joined the queue! Please check your email for confirmation."
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
