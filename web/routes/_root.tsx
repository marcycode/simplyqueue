import { Outlet, useOutletContext } from "@remix-run/react";
import { BlockStack } from "@shopify/polaris";

export default function () {
  const context = useOutletContext();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <BlockStack gap="500">
          <Outlet context={context} />
        </BlockStack>
      </div>
    </div>
  );
}