import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, Page, Text } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
 

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const queue = await context.api.queue.findOne(params["queueId"]!, {
    select: {
      id: true,
      name: true
    }
  });
  return json({ queue });
};

export default function QueueAdd() {
  const data = useLoaderData<typeof loader>();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const { queue } = data;

  return (
    <Page
      title="Add Users"
      subtitle={`Queue: ${queue.name}`}
      backAction={{ content: "Back to Queues", url: "/queues" }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: "16px", textAlign: "center" }}>
              <QRCodeSVG 
                value={`${origin}/public/queues/${queue.id}/join`}
                size={256}
              />
              <Text as="p" variant="bodyMd" alignment="center">
                This functionality is not available yet. Please check back later.
              </Text>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
