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
import { useState, useRef, useCallback } from "react";
import { useParams } from "@remix-run/react";
import { useFindOne, useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import solace from "solclientjs";
import { useEffect } from "react";
import Webcam from "react-webcam";
import { l } from "vite/dist/node/types.d-aGj9QkWt";

export default function() {
  const params = useParams();
  const queueId = params.queueId!;
  const [authImage, setAuthImage] = useState("");

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
    first: 1
  });

  const oldestMember = memberships?.[0];

  console.log("oldestMember", oldestMember);

  // Set up delete action for admitting
  const [{ fetching: admitting }, admit] = useAction(
    api.queueMembership.admit
  );
  

  // Solace stuff should probably go in its own thing... TODO
  const factoryProps = new solace.SolclientFactoryProperties();
  factoryProps.profile = solace.SolclientFactoryProfiles.version10;
  solace.SolclientFactory.init(factoryProps);
  const session = solace.SolclientFactory.createSession({
    url: process.env.SOLACE_URL,
    vpnName: process.env.SOLACE_VPN,
    userName: process.env.SOLACE_USER_NAME,
    password: process.env.SOLACE_PASSWORD,
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
      solace.SolclientFactory.createTopicDestination(`ready/${oldestMember?.id}`)
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

  const WebcamCapture = () => {
    const webcamRef = useRef<Webcam>(null);

    const capture = useCallback(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setAuthImage(imageSrc);
      }
    }, [webcamRef]);

    return (
      <BlockStack gap="200">
        {!authImage && (
          <>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <Button onClick={capture}>Take photo</Button>
          </>
        )}
        {authImage && (
          <>
            <img
              src={authImage}
              alt="captured"
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <Button onClick={() => setAuthImage("")}>Retake</Button>
          </>
        )}
      </BlockStack>
    );
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
                    {oldestMember?.firstName} {oldestMember?.lastName}
                  </Text>
                  <Text as="p" color="subdued">
                    {oldestMember?.email}
                  </Text>
                  {oldestMember.userImage && <img
                    src={oldestMember.userImage}
                    alt="captured"
                    style={{ width: '100%', borderRadius: '8px' }}
                  />}
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
