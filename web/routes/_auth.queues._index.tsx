import { BlockStack, Card, Layout, Page } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { AutoTable } from "@gadgetinc/react/auto/polaris";
import { api } from "../api";

export default function () {
  const navigate = useNavigate();

  return (
    <Page
      title={"Queues"}
      fullWidth
      primaryAction={{
        content: "Create Queue",
        onAction: () => {
          navigate(`/queues/new`);
        },
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <AutoTable
                model={api.queue}
                columns={["name", "status", "description", "updatedAt"]}
                onClick={(row, rowRecord) => navigate(`/queues/update/${rowRecord.id}`)}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}