import { BlockStack, Card, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import {
  AutoForm,
  AutoHasManyForm,
  AutoInput,
  AutoStringInput,
  AutoSubmit,
  SubmitErrorBanner,
} from "@gadgetinc/react/auto/polaris";
import { AutoSaveBar } from "../components/AutoSaveBar";
import { toast } from "../components/ToastManager";
import { api } from "../api";

export default function () {
  const navigate = useNavigate();

  return (
    <Page title={"Create Queue"} backAction={{ content: "Back to index", url: `/queues` }}>
      <AutoForm
        title={false}
        action={api.queue.create}
        onSuccess={(resultRecord) => {
          toast({ content: "Created Queue" });
          navigate(`/queues/update/${resultRecord.id}`);
        }}
      >
        <Layout>
          <Layout.Section variant="fullWidth">
            <AutoSaveBar />
            <SubmitErrorBanner />
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
                  <Text as="h2" variant="headingSm">
                    Queue histories
                  </Text>
                  <AutoHasManyForm field="queueHistories" selectPaths={["event"]} primaryLabel={["event"]}>
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingSm">
                        Queue History Details
                      </Text>
                      <AutoInput field="event" />
                    </BlockStack>
                  </AutoHasManyForm>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">
                    Queue memberships
                  </Text>
                  <AutoHasManyForm field="queueMemberships" selectPaths={["id"]} primaryLabel={["id"]}>
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingSm">
                        Queue Membership Details
                      </Text>
                      <InlineStack gap="400">
                        <AutoInput field="position" />
                        <AutoInput field="status" />
                      </InlineStack>
                    </BlockStack>
                    <AutoInput field="user" />
                  </AutoHasManyForm>
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
              <AutoSubmit variant="primary" />
            </InlineStack>
          </Layout.Section>
        </Layout>
      </AutoForm>
    </Page>
  );
}