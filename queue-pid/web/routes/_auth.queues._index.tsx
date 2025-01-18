import { BlockStack, Button, Card, Layout, Page } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { AutoTable } from "@gadgetinc/react/auto/polaris";
import { api } from "../api";

export default function() {
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
                initialSort={{ createdAt: "Descending" }}
                columns={[
                  "name",
                  "status",
                  "description",
                  "updatedAt",
                  {
                    header: "",
                    render: ({ record }) => (
                      <Button 
                        variant="plain" 
                        onClick={() => navigate(`/queues/${record.id}/queue-memberships/new`)}>
                        Add Users
                      </Button>
                    ),
                  },
                  {
                    header: "",
                    render: ({ record }) => (
                      <Button 
                        variant="primary" 
                        disabled={record.status === "closed"} 
                        onClick={() => { }}>
                        Admit Users
                      </Button>
                    ),
                  },
                ]}
                onClick={(row, rowRecord) => navigate(`/queues/update/${rowRecord.id}`)}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
