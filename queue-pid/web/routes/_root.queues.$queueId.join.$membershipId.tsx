import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  BlockStack,
  Card,
  Text,
  Box,
  Tag,
  Divider,
} from "@shopify/polaris";
import solace from "solclientjs";
import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa"; // Import clock icon

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

    return json({ queue, membership, membershipId });
  } catch (error) {
    throw new Response("Queue or membership not found", { status: 404 });
  }
}

export default function JoinQueueRoute() {
  const { queue, membership, membershipId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [recievedMsg, setRecievedMsg] = useState(false);

  useEffect(() => {
    // Solace connection setup
    var factoryProps = new solace.SolclientFactoryProperties();
    factoryProps.profile = solace.SolclientFactoryProfiles.version10;
    solace.SolclientFactory.init(factoryProps);
    var session = solace.SolclientFactory.createSession({
      url: import.meta.env.VITE_SOLACE_URL,
      vpnName: import.meta.env.VITE_SOLACE_VPN,
      userName: import.meta.env.VITE_SOLACE_USER_NAME,
      password: import.meta.env.VITE_SOLACE_PASSWORD,
    });
    try {
      session.connect();

      session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, (sessionEvent) =>
        console.error(`Cannot subscribe to topic: ${sessionEvent}`)
      );
      session.on(solace.SessionEventCode.SUBSCRIPTION_OK, () => {
        console.log("Subscription OK!!");
      });
      session.on(solace.SessionEventCode.UP_NOTICE, () => {
        console.log("=== Successfully connected and ready to subscribe. ===");
        subscribe();
      });
      session.on(solace.SessionEventCode.MESSAGE, (message) => {
        console.log(
          "message binary attachment: ",
          message.getBinaryAttachment()
        );
        console.log("message dump: ", message.dump());
        setRecievedMsg(true);
      });

      const subscribe = () => {
        try {
          session.subscribe(
            solace.SolclientFactory.createTopicDestination(
              "ready/" + membershipId
            ),
            true,
            "ready",
            10000
          );
        } catch (error) {
          console.error("!!!! error in subscribe function !!!!");
          console.error(error);
        }
      };
    } catch (error) {
      console.error("!!! Solace error !!!");
      console.error(error);
    }
  }, []);

  return (
    <Page>
      <BlockStack gap="400">
        {/* Clock Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <FaClock style={{ fontSize: "50px", color: "#5C5F62" }} />
        </div>

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
                  You've successfully joined "{queue.name}"
                </Text>
                {recievedMsg ? (
                  <>
                    <Divider />
                    <Text variant="bodyMd" as="p">
                      Make your way to C309 and eat up, bubby!
                    </Text>
                  </>
                ) : (
                  ""
                )}
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
