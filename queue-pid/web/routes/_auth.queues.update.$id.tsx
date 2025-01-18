import { BlockStack, Button, Card, InlineGrid, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  AutoForm,
  AutoInput,
  AutoStringInput,
  AutoSubmit,
  AutoTable,
  SubmitResultBanner,
} from "@gadgetinc/react/auto/polaris";
import { AutoSaveBar } from "../components/AutoSaveBar";
import { AutoDeleteButton } from "../components/AutoDeleteButton";
import { toast } from "../components/ToastManager";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { api } from "../api";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const queue = await context.api.queue.findById(params["id"]!);
  return json({ queue });
};

export default function() {
  const navigate = useNavigate();

  const { queue } = useLoaderData<typeof loader>();

  return (
    <Page
      title={queue.name}
      subtitle={`Last updated ${new Date(queue.updatedAt).toLocaleString()}`}
      backAction={{ content: "Back to index", url: `/queues` }}
    >
      <AutoForm title={false} action={api.queue.update} findBy={queue.id}>
        <Layout>
          <Layout.Section variant="fullWidth">
            <AutoSaveBar />
            <SubmitResultBanner />
          </Layout.Section>
          <Layout.Section>
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingSm">
                      Queue Details
                    </Text>
                    <InlineStack gap="400">
                      <AutoInput field="name" />
                      <AutoInput field="status" />
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingSm">
                      Queue Description
                    </Text>
                    <AutoStringInput field="description" multiline={4} />
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <InlineGrid columns="1fr auto">
                    <Text as="h2" variant="headingSm">
                      Queue memberships
                    </Text>
                    <Button url={`/queues/${queue.id}/queue-memberships/new`}>Create Queue membership</Button>
                  </InlineGrid>
                  <AutoTable
                    model={api.queueMembership}
                    columns={["updatedAt", "createdAt"]}
                    onClick={(row, rowRecord) => navigate(`/queue-memberships/update/${rowRecord.id}`)}
                    filter={[{ queueId: { equals: queue.id } }]}
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">
                  Created by
                </Text>
                <AutoInput field="createdBy" />
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <InlineStack gap="300" align="end">
              <AutoDeleteButton
                action={api.queue.delete}
                variables={{ id: queue.id }}
                onSuccess={(record) => {
                  toast({ content: "Deleted Queue" });
                  navigate(`/queues`);
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
