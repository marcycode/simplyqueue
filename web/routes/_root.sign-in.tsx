import { Controller, useActionForm } from "@gadgetinc/react";
import { Link, useLocation, useNavigate, useOutletContext } from "@remix-run/react";
import { BlockStack, Button, Card, Divider, Form, FormLayout, Text, TextField } from "@shopify/polaris";
import { api } from "../api";
import { RootOutletContext } from "../root";

export default function () {
  const { gadgetConfig } = useOutletContext<RootOutletContext>();
  const navigate = useNavigate();
  const {
    submit,
    control,
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.signIn, {
    onSuccess: () =>
      navigate(gadgetConfig.authentication!.redirectOnSuccessfulSignInPath!),
  });
  const { search } = useLocation();

  return (
    <>
      <Card padding="600">
        <Form method="post" onSubmit={submit}>
          <BlockStack gap="500">
            <Text as="h1" variant="heading2xl">
              Login
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
              Continue with Google
            </Button>
            <Divider />
            <FormLayout>
              <Controller
                name="email"
                control={control}
                render={({ field: { ref, ...fieldProps } }) => (
                  <TextField
                    label="Email"
                    autoComplete="off"
                    placeholder="Email"
                    {...fieldProps}
                    value={fieldProps.value ?? ""}
                    error={errors?.user?.email?.message}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field: { ref, ...fieldProps } }) => (
                  <TextField
                    label="Password"
                    autoComplete="off"
                    placeholder="Password"
                    type="password"
                    {...fieldProps}
                    value={fieldProps.value ?? ""}
                    error={errors?.user?.password?.message}
                  />
                )}
              />
              <Button fullWidth size="large" disabled={isSubmitting} submit>
                Continue with email
              </Button>
              {errors?.root?.message && <Text as="p" tone="critical">{errors.root.message}</Text>}
              <Text as="p" variant="bodySm">
                Forgot your password?{" "}
                <Link to="/forgot-password">Reset password</Link>
              </Text>
            </FormLayout>
          </BlockStack>
        </Form>
      </Card>
      <Text as="p" variant="bodySm">
        Don't have an account? <Link to="/sign-up">Get started →</Link>
      </Text>
    </>
  );
}
