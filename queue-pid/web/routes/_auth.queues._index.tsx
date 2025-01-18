import { BlockStack, Button, Card, Layout, Page } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { AutoTable } from "@gadgetinc/react/auto/polaris";
import { api } from "../api";
import gizmoImage from "../../assets/gizmo.png";

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
                        onClick={() => navigate(`/queues/${record.id}/add`)}>
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
                        onClick={() => navigate(`/queues/${record.id}/queue-memberships/new` /* CHANGE URL TO ADMIT PAGE */)}>
                        Admit Users
                      </Button>
                    ),
                  },
                  {
                    header: "",
                    render: ({ record }) => (
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/queues/update/${record.id}/`)}>
                        Edit Queue
                      </Button>
                    ),
                  },
                ]}

              />
             
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
