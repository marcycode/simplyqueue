import { AutoForm, AutoInput, AutoFileInput, SubmitResultBanner } from "@gadgetinc/react/auto/polaris";
import { Link, useLocation, useNavigate, useOutletContext } from "@remix-run/react";
import { BlockStack, Button, Card, Divider, Text } from "@shopify/polaris";
import { api } from "../api";
import { RootOutletContext } from "../root";

export default function() {
  const { gadgetConfig } = useOutletContext<RootOutletContext>();
  const { search } = useLocation();
  const navigate = useNavigate();

  return (
    <Card>
      <BlockStack gap="500">
        <Text as="h1" variant="heading2xl">
          Get started
        </Text>
        <Button
          url={`/auth/google/start${search}`}
          variant="primary"
          size="large"
          icon={
            <img
              className="button-icon"
              src="https://assets.gadget.dev/assets/default-app-assets/google.svg"
              width={14}
              height={14}
            />
          }
        >
          Sign up with Google
        </Button>
        <Divider />
        <AutoForm
          action={api.user.signUp}
          defaultValues={{
            inviteCode: new URLSearchParams(search).get("inviteCode"),
          }}
          onSuccess={() => {
            navigate(gadgetConfig.authentication!.redirectOnSuccessfulSignInPath!);
          }}
          onError={(error) => {
            console.error("Sign up error:", error);
          }}
        >
          <BlockStack gap="300">
            <AutoInput 
              field="firstName"
              props={{
                helpText: "Enter your first name"
              }}
            />
            <AutoInput
              field="lastName"
              props={{
                helpText: "Enter your last name"
              }}
            />
            <AutoInput
              field="phone"
              props={{
                helpText: "Enter your phone number"
              }}
            />
          </BlockStack>
          
          <BlockStack gap="300">
            <AutoInput
              field="email"
              props={{
                helpText: "We'll send important notifications here"
              }}
            />
            <AutoInput
              field="password"
              props={{
                type: "password",
                autoComplete: "new-password",
                helpText: "Password must be at least 8 characters"
              }}
            />
          </BlockStack>
          
          <AutoFileInput
            field="profilePicture"
            props={{
              label: "Profile Picture",
              accept: "image/jpeg,image/png,image/gif",
              helpText: "Upload a profile picture (max 5MB, JPG/PNG/GIF)",
              dropOnPage: false,
              allowMultiple: false
            }}
          />
          
          <Button
            submit
            variant="primary"
            size="large"
            fullWidth
          >
            Sign up with email
          </Button>
          <SubmitResultBanner />
        </AutoForm>
        
        <Text as="p" variant="bodySm">
          Already have an account? <Link to="/sign-in">Login →</Link>
        </Text>
      </BlockStack>
    </Card>
  );
}