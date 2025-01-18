import { AutoTable } from "@gadgetinc/react/auto/polaris";
import { useNavigate } from "@remix-run/react";
import { Card, Page, Layout } from "@shopify/polaris";
import { api } from "../api";

export default function () {
  return (
    <Page title={"Team"}>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            <AutoTable
              model={api.user}
              columns={[
                "firstName",
                "lastName",
                "email",
                "emailVerified",
                "roles",
              ]}
              excludeActions={["signOut", "delete"]}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
