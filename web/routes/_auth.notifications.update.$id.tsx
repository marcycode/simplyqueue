import { BlockStack, Card, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { AutoForm, AutoInput, AutoSubmit, SubmitResultBanner } from "@gadgetinc/react/auto/polaris";
import { AutoSaveBar } from "../components/AutoSaveBar";
import { AutoDeleteButton } from "../components/AutoDeleteButton";
import { toast } from "../components/ToastManager";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { api } from "../api";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const notification = await context.api.notification.findById(params["id"]!);
  return json({ notification });
};

export default function () {
  const navigate = useNavigate();

  const { notification } = useLoaderData<typeof loader>();

  return (
    <Page
      title={notification.message}
      subtitle={`Last updated ${new Date(notification.updatedAt).toLocaleString()}`}
      backAction={{ content: "Back to index", url: `/notifications` }}
    >
      <AutoForm title={false} action={api.notification.update} findBy={notification.id}>
        <Layout>
          <Layout.Section variant="fullWidth">
            <AutoSaveBar />
            <SubmitResultBanner />
          </Layout.Section>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">
                    Notification Details
                  </Text>
                  <AutoInput field="message" />
                  <AutoInput field="read" />
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">
                  User
                </Text>
                <AutoInput field="user" />
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <InlineStack gap="300" align="end">
              <AutoDeleteButton
                action={api.notification.delete}
                variables={{ id: notification.id }}
                onSuccess={(record) => {
                  toast({ content: "Deleted Notification" });
                  navigate(`/notifications`);
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