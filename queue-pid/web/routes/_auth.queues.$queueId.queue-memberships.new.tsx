import {
  Banner,
  BlockStack,
  Button,
  Card,
  Layout,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { useParams } from "@remix-run/react";
import { useFindOne, useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import solace from "solclientjs";
import { useEffect } from "react";
import { l } from "vite/dist/node/types.d-aGj9QkWt";

export default function() {
  const params = useParams();
  const queueId = params.queueId!;

  // Fetch queue details
  const [{ data: queue, fetching: fetchingQueue, error: queueError }] =
    useFindOne(api.queue, queueId);

  // Fetch oldest queue membership
  const [
    {
      data: memberships,
      fetching: fetchingMemberships,
      error: membershipsError,
    },
  ] = useFindMany(api.queueMembership, {
    filter: { queueId: { equals: queueId } },
    sort: { createdAt: "Ascending" },
    first: 1,
    select: {
      id: true,
      createdAt: true,
      user: {
        firstName: true,
        lastName: true,
        email: true,
      },
    },
  });

  const oldestMember = memberships?.[0];

  // Set up delete action for admitting
  const [{ fetching: admitting }, admit] = useAction(
    api.queueMembership.delete
  );

  // Solace stuff should probably go in its own thing... TODO
  var factoryProps = new solace.SolclientFactoryProperties();
  factoryProps.profile = solace.SolclientFactoryProfiles.version10;
  solace.SolclientFactory.init(factoryProps);
  var session = solace.SolclientFactory.createSession({
    url: "wss://mr-connection-3j8278prrj0.messaging.solace.cloud:443",
    vpnName: "queue-pid-broker",
    userName: "solace-cloud-client",
    // ENV VAR 😬
    password: "k6nf8vl7msf3b5uha6uoi01sfq",
  });
  try {
    console.log("Test");
    session.connect();

    session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, (sessionEvent) =>
      console.error(`Cannot subscribe to topic: ${sessionEvent}`)
    );
    session.on(solace.SessionEventCode.SUBSCRIPTION_OK, () => {
      console.log("Subscription OK!!");
    });
    session.on(solace.SessionEventCode.UP_NOTICE, () => {
      console.log("=== Successfully connected and ready to publish. ===");
    });
  } catch (error) {
    console.error("!!! Solace error !!!");
    console.error(error);
  }

  const publish = () => {
    // If we need to include metadata, it goes here:
    const msgText = "Test";
    const msg = solace.SolclientFactory.createMessage();
    msg.setDestination(
      solace.SolclientFactory.createTopicDestination(`/ready/${oldestMember?.userId}`)
    );
    msg.setBinaryAttachment(msgText);
    msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
    if (session) {
      try {
        session.send(msg);
        console.log("Message published!!!");
      } catch (error) {
        console.error("!!! Message failed to publish !!!");
        console.error(error);
      }
    } else console.log("Session does not exist — cannot publish message.");
  };

  const handleAdmit = (id: string) => {
    admit({ id: id });
    publish();
  };

  // Handle loading states
  if (fetchingQueue || fetchingMemberships) {
    return (
      <Page title="Queue Details">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Spinner accessibilityLabel="Loading" size="large" />
                <Text as="p" alignment="center">
                  Loading queue details...
                </Text>
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
              {queueError?.message ||
                membershipsError?.message ||
                "An error occurred loading the queue"}
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page
      title={`Manage Queue: ${queue?.name}`}
      backAction={{ content: "Back to Queues", url: "/queues" }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Next in Queue
              </Text>

              {!oldestMember && (
                <Text as="p" color="subdued">
                  No one is currently in the queue
                </Text>
              )}

              {oldestMember && (
                <BlockStack gap="200">
                  <Text as="p">
                    {oldestMember.user?.firstName} {oldestMember.user?.lastName}
                  </Text>
                  <Text as="p" color="subdued">
                    {oldestMember.user?.email}
                  </Text>
                  <Button
                    onClick={() => handleAdmit(oldestMember.id)}
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
