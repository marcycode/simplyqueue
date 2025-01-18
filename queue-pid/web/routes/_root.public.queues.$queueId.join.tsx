import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Text } from "@shopify/polaris";
import { AutoForm } from "@gadgetinc/react/auto/polaris";
import { api } from "../api";

export async function loader({ context, params }: LoaderFunctionArgs) {
  try {
    const queue = await context.api.queue.findOne(params.queueId!, {
      select: {
        id: true,
        name: true,
        status: true,
      }
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

  return (
    <Page title={`Join ${queue.name}`}>  
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              <Text as="p" variant="bodyMd">
                Please provide your information to join {queue.name}. You will receive a confirmation email once you've been added to the queue.
              </Text>
            </Card.Section>
            <AutoForm
              model="user"
              action="signUp"
              fields={["firstName", "lastName", "email"]}
              validates={{
                firstName: { required: true },
                lastName: { required: true },
                email: { required: true, email: true }
              }}
              submitActionText="Join Queue"
              successMessage="Successfully joined the queue! Please check your email for confirmation."
              errorMessage="There was an error joining the queue"
              defaultValues={{
                roles: ["signed-in"]
              }}
              onSubmit={async (fields) => {
                try {
                  const signUpResult = await api.user.signUp({
                    firstName: fields.firstName,
                    lastName: fields.lastName,
                    email: fields.email,
                    roles: ["signed-in"]
                  });

                  if (!signUpResult.user) {
                    throw new Error("Failed to create user account");
                  }

                  await api.queueMembership.create({
                    queue: { _link: queue.id },
                    user: { _link: signUpResult.user.id }
                  });

                  return { success: true };
                } catch (error) {
                  console.error("Error joining queue:", error);
                  return {
                    error: error instanceof Error ? error.message : "Failed to join queue"
                  };
                }
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}