import { Banner, BlockStack, Button, Card, Layout, Page, Spinner, Text } from "@shopify/polaris";
import { useParams } from "@remix-run/react";
import { useFindOne, useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
 

export default function() {
  const params = useParams();
  const queueId = params.queueId!;
  
  // Fetch queue details
  const [{ data: queue, fetching: fetchingQueue, error: queueError }] = useFindOne(api.queue, queueId);
  
  // Fetch oldest queue membership
  const [{ data: memberships, fetching: fetchingMemberships, error: membershipsError }] = useFindMany(
    api.queueMembership,
    {
      filter: { queueId: { equals: queueId } },
      sort: { createdAt: "Ascending" },
      first: 1,
      select: {
        id: true,
        createdAt: true,
        user: {
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  );
  
  // Set up delete action for admitting
  const [{ fetching: admitting }, admit] = useAction(api.queueMembership.delete);
  
  // Handle loading states
  if (fetchingQueue || fetchingMemberships) {
    return (
      <Page title="Queue Details">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Spinner accessibilityLabel="Loading" size="large" />
                <Text as="p" alignment="center">Loading queue details...</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  
  // Handle errors
  if (queueError || membershipsError) {
    return (
      <Page title="Queue Details">
        <Layout>
          <Layout.Section>
            <Banner status="critical">
              {queueError?.message || membershipsError?.message || "An error occurred loading the queue"}
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  
  const oldestMember = memberships?.[0];
 

  return (
    <Page
      title={`Manage Queue: ${queue?.name}`}
      backAction={{ content: "Back to Queues", url: "/queues" }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Next in Queue</Text>
              
              {!oldestMember && (
                <Text as="p" color="subdued">No one is currently in the queue</Text>
              )}
              
              {oldestMember && (
                <BlockStack gap="200">
                  <Text as="p">
                    {oldestMember.user?.firstName} {oldestMember.user?.lastName}
                  </Text>
                  <Text as="p" color="subdued">{oldestMember.user?.email}</Text>
                  <Button 
                    onClick={() => void admit({ id: oldestMember.id })}
                    loading={admitting}
                    variant="primary"
                  >
                    Admit Member
                  </Button>
                </BlockStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
