import { BlockStack, Card, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { AutoForm, AutoHiddenInput, AutoInput, AutoSubmit, SubmitErrorBanner } from "@gadgetinc/react/auto/polaris";
import { AutoSaveBar } from "../components/AutoSaveBar";
import { toast } from "../components/ToastManager";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { api } from "../api";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const queue = await context.api.queue.findById(params["queueId"]!);
  return json({ queue });
};

export default function () {
  const navigate = useNavigate();

  const { queue } = useLoaderData<typeof loader>();

  return (
    <Page
      title={"Create Queue membership"}
      backAction={{ content: "Back to parent", url: `/queues/update/${queue.id}` }}
    >
      <AutoForm
        title={false}
        action={api.queueMembership.create}
        onSuccess={(resultRecord) => {
          toast({ content: "Created Queue membership" });
          navigate(`/queue-memberships/update/${resultRecord.id}`);
        }}
      >
        <Layout>
          <Layout.Section variant="fullWidth">
            <AutoSaveBar />
            <SubmitErrorBanner />
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
                    <InlineStack gap="400">
                      <AutoInput field="position" />
                      <AutoInput field="status" />
                    </InlineStack>
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
              <AutoSubmit variant="primary" />
            </InlineStack>
          </Layout.Section>
        </Layout>
      </AutoForm>
    </Page>
  );
}