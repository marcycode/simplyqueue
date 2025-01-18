import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Banner, BlockStack, Card, Layout, Page, Text } from "@shopify/polaris";
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  try {
    const queue = await context.api.queue.findById(params["queueId"]!, {
      select: {
        id: true,
        name: true,
        status: true
      }
    });

    if (queue.status === "closed") {
      throw new Error("This queue is currently closed");
    }
    
    return json({ queue });
  } catch (error) {
    return json(
      { 
        error: error instanceof Error ? error.message : "Queue not found"
      },
      { status: 404 }
    );
  }
};

export default function QueueAdd() {
  const data = useLoaderData<typeof loader>();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if ("error" in data) {
    return (
      <Page title="Queue Not Available">
        <Layout>
          <Layout.Section>
            <Banner status="critical">
              {data.error}
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const { queue } = data;

  return (
    <Page
      title="Add Users"
      subtitle={
        `Queue: ${queue.name}`
      }
      backAction={{ content: "Back to Queues", url: "/queues" }}
    >
      <Layout>
        <Layout.Section>
          <Card padding="500">
            <BlockStack gap="800" align="center"> 
              <Text as="p" variant="bodyMd" alignment="center">
                Share this QR code with users to join the queue. When scanned, they will be asked to create an account
                and will automatically be added to the queue. They will receive a confirmation email once joined.
              </Text>
              {origin && (
                <div style={{ padding: "24px" }}>
                  <QRCodeSVG 
                    value={`${origin}/public/queues/${queue.id}/join`}
                    size={256}
                  />
                </div>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}