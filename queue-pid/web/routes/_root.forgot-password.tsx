import { Controller, useActionForm } from "@gadgetinc/react";
import { Button, Card, Form, FormLayout, Text, TextField } from "@shopify/polaris";
import { api } from "../api";

export default function () {
  const {
    submit,
    control,
    formState: { isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.sendResetPassword);

  return (
    <Card padding="600">
      {isSubmitSuccessful ? (
        <p className="format-message success">Email has been sent. Please check your inbox.</p>
      ) : (
        <Form onSubmit={submit}>
          <FormLayout>
            <Text as="h2" variant="heading2xl">
              Reset password
            </Text>
            <Controller
              name="email"
              control={control}
              render={({ field: { ref, ...fieldProps } }) => (
                <TextField label="Email" autoComplete="off" placeholder="gizmo@gadget.dev" {...fieldProps} value={fieldProps.value ?? ""} />
              )}
            />
            <Button disabled={isSubmitting} submit>
              Send reset link
            </Button>
          </FormLayout>
        </Form>
      )}
    </Card>
  );
}
