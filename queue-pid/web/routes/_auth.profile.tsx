import { Controller, useActionForm } from "@gadgetinc/react";
import { AutoForm, AutoInput, AutoSubmit, AutoStringInput } from "@gadgetinc/react/auto/polaris";
import { useOutletContext } from "@remix-run/react";
import { Card, Page, Layout, BlockStack, InlineGrid, Button, Text, InlineStack, Thumbnail, ButtonGroup, Avatar, Modal, Form, FormLayout, TextField } from "@shopify/polaris";
import { useState } from "react";
import { AuthOutletContext } from "./_auth";
import { api } from "../api";

export default function() {
  const { user } = useOutletContext<AuthOutletContext>();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const hasName = user.firstName || user.lastName;
  const title = hasName ? `${user.firstName} ${user.lastName}` : user.email;
  const initials = hasName
    ? (user.firstName?.slice(0, 1) ?? "") + (user.lastName?.slice(0, 1) ?? "")
    : "";

  return (
    <Page title={"Profile"}>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <InlineGrid columns="1fr auto" alignItems="start">
                <InlineStack gap="300">
                  <Avatar size="xl" initials={initials} source={user.profilePicture?.url} />
                  <BlockStack>
                    <Text as="h2" variant="headingSm">
                      {title}
                    </Text>
                    {hasName && (
                      <Text as="p" variant="bodyMd">
                        {user.email}
                      </Text>
                    )}
                  </BlockStack>
                </InlineStack>
                <ButtonGroup>
                  {!user.googleProfileId && (
                    <Button
                      variant="plain"
                      accessibilityLabel="Change password"
                      onClick={() => setIsChangingPassword(true)}
                    >
                      Change password
                    </Button>
                  )}
                  <Button
                    variant="plain"
                    onClick={() => setIsEditing(true)}
                    accessibilityLabel="Edit"
                  >
                    Edit
                  </Button>
                </ButtonGroup>
              </InlineGrid>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      <EditProfileModal open={isEditing} onClose={() => setIsEditing(false)} />
      <ChangePasswordModal
        open={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
      />
    </Page>
  );
}

const EditProfileModal = (props: { open: boolean; onClose: () => void; }) => {
  const { user } = useOutletContext<AuthOutletContext>();

  return (
    <Modal open={props.open} onClose={props.onClose} title="Edit profile">
      <AutoForm
        action={api.user.update}
        findBy={user.id}
        onSuccess={() => {
          props.onClose();
          window.location.reload();
        }}
      >
        <Modal.Section>
          <FormLayout>
            <AutoInput field="profilePicture" />
            <AutoStringInput field="firstName" placeholder="First name" />
            <AutoStringInput field="lastName" placeholder="Last name" />
          </FormLayout>
        </Modal.Section>
        <Modal.Section flush>
          <div
            style={{
              float: "right",
              paddingBottom: "16px",
              paddingRight: "16px",
            }}
          >
            <ButtonGroup>
              <Button onClick={props.onClose}>Cancel</Button>
              <AutoSubmit variant="primary">Save</AutoSubmit>
            </ButtonGroup>
          </div>
        </Modal.Section>
      </AutoForm>
    </Modal>
  );
};

const ChangePasswordModal = (props: { open: boolean; onClose: () => void; }) => {
  const { user } = useOutletContext<AuthOutletContext>();
  const {
    control,
    submit,
    reset,
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.changePassword, {
    defaultValues: user,
    onSuccess: props.onClose,
  });

  const onClose = () => {
    reset();
    props.onClose();
  };

  return (
    <Modal open={props.open} onClose={onClose} title="Change password">
      <Form onSubmit={submit}>
        <Modal.Section>
          <FormLayout>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => {
                const { ref, ...fieldProps } = field;

                return (
                  <TextField
                    label="Current password"
                    autoComplete="off"
                    type="password"
                    {...fieldProps}
                  />
                );
              }}
            />
            {errors?.root?.message && (
              <Text as="p" tone="critical">
                {errors.root.message}
              </Text>
            )}
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => {
                const { ref, ...fieldProps } = field;

                return (
                  <TextField
                    label="New password"
                    autoComplete="off"
                    type="password"
                    {...fieldProps}
                  />
                );
              }}
            />
            {errors?.user?.password?.message && (
              <Text as="p" tone="critical">
                New password {errors.user.password.message}
              </Text>
            )}
          </FormLayout>
        </Modal.Section>
        <Modal.Section flush>
          <div
            style={{
              float: "right",
              paddingTop: "16px",
              paddingBottom: "16px",
              paddingRight: "16px",
            }}
          >
            <ButtonGroup>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="primary" disabled={isSubmitting} submit>
                Save
              </Button>
            </ButtonGroup>
          </div>
        </Modal.Section>
      </Form>
    </Modal>
  );
};
