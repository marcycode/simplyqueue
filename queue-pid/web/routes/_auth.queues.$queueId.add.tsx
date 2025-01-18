import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, Page, Text } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const queue = await context.api.queue.findOne(params["queueId"]!, {
    select: {
      id: true,
      name: true,
    },
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

  console.log("link: ");
  console.log(`${origin}/queues/${queue.id}/sign-up`);

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
                value={`${origin}/queues/${queue.id}/sign-up`}
                size={256}
              />
              <Text as="p" variant="bodyMd" alignment="center">
                Scan the QR code to claim your spot in line ✨
              </Text>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
