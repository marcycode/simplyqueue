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
import solace from "solclientjs";
import { useEffect, useState } from "react";

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
    throw new Response('Queue or membership not found', { status: 404 });
  }
}

export default function JoinQueueRoute() {
  const { queue, membership, membershipId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [recievedMsg, setRecievedMsg] = useState(false);

  // useEffect(() => {
  //   // Solace stuff should probably go in its own thing... TODO
  //   var factoryProps = new solace.SolclientFactoryProperties();
  //   factoryProps.profile = solace.SolclientFactoryProfiles.version10;
  //   solace.SolclientFactory.init(factoryProps);
  //   var session = solace.SolclientFactory.createSession({
  //     url: process.env.SOLACE_URL,
  //     vpnName: process.env.SOLACE_VPN,
  //     userName: process.env.SOLACE_USER_NAME,
  //     // ENV VAR 😬
  //     password: process.env.SOLACE_PASSWORD,
  //   });
  //   try {
  //     console.log("Test");
  //     session.connect();

  //     session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, (sessionEvent) =>
  //       console.error(`Cannot subscribe to topic: ${sessionEvent}`)
  //     );
  //     session.on(solace.SessionEventCode.SUBSCRIPTION_OK, () => {
  //       console.log("Subscription OK!!");
  //     });
  //     session.on(solace.SessionEventCode.UP_NOTICE, () => {
  //       console.log("=== Successfully connected and ready to subscribe. ===");
  //       subscribe();
  //     });
  //     session.on(solace.SessionEventCode.MESSAGE, (message) => {
  //       console.log(
  //         "message binary attachment: ",
  //         message.getBinaryAttachment()
  //       );
  //       console.log("message dump: ", message.dump());
  //       setRecievedMsg(true);
  //     });

  //   } catch (error) {
  //     console.error("!!! Solace error !!!");
  //     console.error(error);
  //   }
  // }, []);

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
                  You've successfully joined "{queue.name}"
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
