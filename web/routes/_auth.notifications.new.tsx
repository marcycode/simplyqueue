import { BlockStack, Card, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { AutoForm, AutoInput, AutoSubmit, SubmitErrorBanner } from "@gadgetinc/react/auto/polaris";
import { AutoSaveBar } from "../components/AutoSaveBar";
import { toast } from "../components/ToastManager";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { DefaultUserSelection } from "@gadget-client/queue-pid";
import { api } from "../api";

export const loader = async ({ context, params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const userId = url.searchParams.get("userId");
  const userSelection = { ...DefaultUserSelection, updatedAt: false, createdAt: false };
  const user = userId ? await context.api.user.maybeFindById(userId, { select: userSelection }) : undefined;
  const hasDefaultValues = user;
  const defaultValues = hasDefaultValues
    ? {
        notification: {
          ...(user && { user }),
        },
      }
    : undefined;
  return json({ defaultValues });
};

export default function () {
  const navigate = useNavigate();

  const { defaultValues } = useLoaderData<typeof loader>();

  return (
    <Page title={"Create Notification"} backAction={{ content: "Back to index", url: `/notifications` }}>
      <AutoForm
        title={false}
        action={api.notification.create}
        defaultValues={defaultValues}
        onSuccess={(resultRecord) => {
          toast({ content: "Created Notification" });
          navigate(`/notifications/update/${resultRecord.id}`);
        }}
      >
        <Layout>
          <Layout.Section variant="fullWidth">
            <AutoSaveBar />
            <SubmitErrorBanner />
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
              <AutoSubmit variant="primary" />
            </InlineStack>
          </Layout.Section>
        </Layout>
      </AutoForm>
    </Page>
  );
}