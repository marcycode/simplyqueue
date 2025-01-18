import { BlockStack, Box, Button, Card, Icon, InlineStack, Layout, Link, List, Page, Text } from "@shopify/polaris";
import { SkeletonIcon } from "@shopify/polaris-icons";

export default function() {
  return (
    <Page title="Home">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack inlineAlign="start" gap="400">
              <Text as="h2" variant="headingSm">1. Explore your app</Text>
              <Text as="p">Check the nav to browse through your app and tests its features.</Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack inlineAlign="start" gap="400">
              <Text as="h2" variant="headingSm">2. Continue editing your app</Text>
              <Text as="p" variant="bodyMd">
                A few of your requirements were not completed during the initial scaffold
              </Text>
              <InlineStack gap="200">
                <Icon source={SkeletonIcon} />
                <Text as="p">Add queue tracking page for users</Text>
              </InlineStack>
              <InlineStack gap="200">
                <Icon source={SkeletonIcon} />
                <Text as="p">Add queue processing functionality for authorized users</Text>
              </InlineStack>
              <InlineStack gap="200">
                <Icon source={SkeletonIcon} />
                <Text as="p">Implement model actions for queue processing</Text>
              </InlineStack>
              <InlineStack gap="200">
                <Icon source={SkeletonIcon} />
                <Text as="p">Add notifications for queue status updates</Text>
              </InlineStack>
              <Box background="bg-surface-secondary" width="100%" padding="400" borderRadius="300">
                <BlockStack gap="400">
                  <Text as="h2" variant="headingSm">Edit in Gadget</Text>
                  <Text as="p">Access the source code in Gadget and continue to iterate on your app with AI.</Text>
                  <div>
                    <Button variant="primary" url="/edit/development" external>Open Editor</Button>
                  </div>
                </BlockStack>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}