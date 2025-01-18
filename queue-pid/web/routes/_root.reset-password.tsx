import { Controller, useActionForm } from "@gadgetinc/react";
import { Link, useLocation, useOutletContext } from "@remix-run/react";
import { BlockStack, Button, Card, Form, FormLayout, Text, TextField } from "@shopify/polaris";
import { api } from "../api";
import type { RootOutletContext } from "../root";

export default function ResetPasswordPage() {
  const location = useLocation();
  const { gadgetConfig } = useOutletContext<RootOutletContext>();

  const {
    submit,
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.resetPassword, {
    defaultValues: {
      code: new URLSearchParams(location.search).get("code"),
      password: "",
      confirmPassword: "",
    },
  });

  return isSubmitSuccessful ? (
    <Text as="p" variant="bodyMd" tone="success">
      Password reset successfully.{" "}
      <Link to={gadgetConfig.authentication!.signInPath}>Sign in now</Link>
    </Text>
  ) : (
    <>
      <Card padding="600">
        <Form method="post" onSubmit={submit}>
          <BlockStack gap="500">
            <Text as="h1" variant="heading2xl">
              Reset Password
            </Text>
            <FormLayout>
              <Controller
                name="password"
                control={control}
                render={({ field: { ref, ...fieldProps } }) => (
                  <TextField
                    label="New password"
                    autoComplete="off"
                    type="password"
                    {...fieldProps}
                    value={fieldProps.value ?? ""}
                    error={errors?.user?.password?.message}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { ref, ...fieldProps } }) => (
                  <TextField
                    label="Confirm password"
                    autoComplete="off"
                    type="password"
                    {...fieldProps}
                    value={fieldProps.value ?? ""}
                    error={errors?.confirmPassword?.message}
                  />
                )}
              />
              {errors?.root?.message && (
                <Text as="p" variant="bodyMd" tone="critical">
                  {errors.root.message}
                </Text>
              )}
              <Button fullWidth size="large" disabled={isSubmitting} submit>
                Reset password
              </Button>
            </FormLayout>
          </BlockStack>
        </Form>
      </Card>
      <Text as="p" variant="bodySm">
        Remembered your password? <Link to="/sign-in">Login →</Link>
      </Text>
    </>
  );
}
