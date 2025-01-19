import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, useNavigate } from "@remix-run/react";
import {
  Page,
  BlockStack,
  Card,
  Text,
  Box,
  Tag,
  Banner,
  Divider,
} from "@shopify/polaris";
import { AutoForm, SubmitResultBanner } from "@gadgetinc/react/auto/polaris";
import { api } from "../api";
import { useEffect, useState } from "react";
import solace from "solclientjs";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { queueId, membershipId } = params;

  try {

    const [queue, membership] = await Promise.all([
      context.api.queue.findOne(queueId!, {
        select: { name: true, description: true },
      }),
      context.api.queueMembership.findOne(membershipId!, {
        select: { firstName: true, lastName: true, email: true },
      }),
    ]);

    let position = null;
    try {
      const response = await fetch(
        `https://simplyqueue-production.up.railway.app/${queueId}/pos/${membershipId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch position: ${response.statusText}`);
      }

      const data = await response.json();
      position = data.postion;
    } catch (error) {
      console.error("Error fetching position:", error);
    }

    return json({ queue, membership, membershipId, position });
  } catch (error) {
    throw new Response('Queue or membership not found', { status: 404 });
  }
}

export default function JoinQueueRoute() {
  const { queue, membership, membershipId, position } = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const [recievedMsg, setRecievedMsg] = useState(false);

  useEffect(() => {
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
      if (!sessionRef.current) {
      console.log("Session does not exist — cannot publish message.");
      return;
    }

    const msg = solace.SolclientFactory.createMessage();
    msg.setDestination(
      solace.SolclientFactory.createTopicDestination(`ready/${membershipId}`)
    );
    msg.setBinaryAttachment("");
    msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);

    try {
      sessionRef.current.send(msg);
      console.log("Message published!!!");
    } catch (error) {
      console.error("!!! Message failed to publish !!!");
      console.error(error);
    }
  }, []);

  const subscribe = (memberId: string) => {
    try {
      sessionRef.subscribe(
        solace.SolclientFactory.createTopicDestination("ready/" + memberId),
        true,
        "ready",
        10000
      );
    } catch (error) {
      console.error("!!!! error in subscribe function !!!!");
      console.error(error);
    }
  };
  }, []);

  return (
    <Page>
      <BlockStack gap="400">
        <Card>
          <Box padding="400">
            <div style={{ position: "relative", paddingBottom: "50px" }}>
              <BlockStack gap="400">
                <Text variant="headingLg" as="h2">
                  Hello {membership.firstName}!
                </Text>
                {queue.description && (
                  <Text variant="bodyMd" as="p">
                    {queue.description}
                  </Text>
                )}
                <Text variant="bodyMd" as="p">
                  You've successfully joined "{queue.name}". {position ? `You are in position ${position}.` : "Your position is being calculated..."}
                </Text>
                {recievedMsg ? (
                  <>
                    <Divider />
                    <Text variant="bodyMd" as="p">Make your way to C309 and eat up, bubby!</Text>
                  </>
                ) : ""}
              </BlockStack>
              <div style={{ position: "absolute", bottom: "0", right: "0" }}>
                {recievedMsg ? (
                  <Tag size="large">Ready 🔥</Tag>
                ) : (
                  <div>
                    <Tag size="large">Waiting 😔</Tag>
                  </div>
                )}
              </div>
            </div>
          </Box>
        </Card>
      </BlockStack>
    </Page>
  );
}
