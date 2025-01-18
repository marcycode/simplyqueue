import { BlockStack, Card, Layout, Page } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { AutoTable } from "@gadgetinc/react/auto/polaris";
import { api } from "../api";

export default function () {
  const navigate = useNavigate();

  return (
    <Page
      title={"Notifications"}
      fullWidth
      primaryAction={{
        content: "Create Notification",
        onAction: () => {
          navigate(`/notifications/new`);
        },
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <AutoTable
                model={api.notification}
                columns={["message", "read", "updatedAt"]}
                onClick={(row, rowRecord) => navigate(`/notifications/update/${rowRecord.id}`)}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}