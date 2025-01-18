import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BlockStack, Card, Layout, Page, Text } from "@shopify/polaris";
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const queue = await context.api.queue.findById(params.["queueId"]!);
  return json({ queue });
};

export default function QueueAdmit() {
  const { queue } = useLoaderData<typeof loader>();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <Page
      title="Admit Users"
      subtitle={`Queue: ${queue.name}`}
      backAction={{ content: "Back to Queues", url: "/queues" }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="800" align="center">
              <Text as="p" variant="bodyMd">
                Scan this QR code to join the queue
              </Text>
              {origin && (
                <div style={{ padding: "24px" }}>
                  <QRCodeSVG value={origin} size={256} />
                </div>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}