import { BlockStack, Card, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { AutoForm, AutoHiddenInput, AutoInput, AutoSubmit, SubmitResultBanner } from "@gadgetinc/react/auto/polaris";
import { AutoSaveBar } from "../components/AutoSaveBar";
import { AutoDeleteButton } from "../components/AutoDeleteButton";
import { toast } from "../components/ToastManager";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { DefaultQueueMembershipSelection, DefaultQueueSelection } from "@gadget-client/queue-pid";
import { api } from "../api";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const queueMembership = await context.api.queueMembership.findById(params["id"]!, {
    select: {
      ...DefaultQueueMembershipSelection,
      queue: DefaultQueueSelection,
    },
  });
  const queue = queueMembership.queue;
  return json({ queue, queueMembership });
};

export default function() {
  const navigate = useNavigate();

  const { queue, queueMembership } = useLoaderData<typeof loader>();

  return (
    <Page
      title={`Queue membership #${queueMembership.id}`}
      subtitle={`Last updated ${new Date(queueMembership.updatedAt).toLocaleString()}`}
      backAction={{ content: "Back to parent", url: `/queues/update/${queue.id}` }}
    >
      <AutoForm title={false} action={api.queueMembership.update} findBy={queueMembership.id}>
        <Layout>
          <Layout.Section variant="fullWidth">
            <AutoSaveBar />
            <SubmitResultBanner />
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">
                  Queue
                </Text>
                <Text as="span">{queue["name"]}</Text>
                <AutoHiddenInput field="queue" value={queue.id} />
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingSm">
                      Queue Membership Details
                    </Text>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">
                    User
                  </Text>
                  <AutoInput field="user" />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
          <Layout.Section>
            <InlineStack gap="300" align="end">
              <AutoDeleteButton
                action={api.queueMembership.delete}
                variables={{ id: queueMembership.id }}
                onSuccess={(record) => {
                  toast({ content: "Deleted Queue membership" });
                  navigate(`/queues/update/${queue.id}`);
                }}
              >
                Delete
              </AutoDeleteButton>
              <AutoSubmit variant="primary" />
            </InlineStack>
          </Layout.Section>
        </Layout>
      </AutoForm>
    </Page>
  );
}