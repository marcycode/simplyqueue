import { useAction } from "@gadgetinc/react";
import { AutoTable, AutoForm, AutoEmailInput, AutoSubmit } from "@gadgetinc/react/auto/polaris";
import { Button, ButtonGroup, Card, Layout, Link, Modal, Page, Toast } from "@shopify/polaris";
import { useState } from "react";
import { api } from "../api";

export default function() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [resendInviteMessage, setResendInviteMessage] = useState<{message: string, isError?: boolean} | null>(null);
  const [_, resendInvite] = useAction(api.invite.resend);

  return (
    <Page
      title={"Invite team"}
      primaryAction={
        <Button variant="primary" onClick={() => setShowInviteModal(true)}>Invite</Button>
      }
    >
      <Layout>
        <Layout.Section>
          <Card padding="0">
            <AutoTable
              model={api.invite}
              columns={[
                "email",
                {
                  header: "Sent at",
                  render: ({ record }) => {
                    return record.updatedAt
                      ? record.updatedAt.toLocaleString()
                      : "";
                  },
                },
                {
                  header: "",
                  render: ({ record }) => {
                    return (
                      <Link
                        dataPrimaryLink
                        onClick={async () => {
                          const { error } = await resendInvite({ id: record.id });
                          setResendInviteMessage(error ? {isError: true, message: "Failed to resend"} : {message: "Invite resent"});
                        }}
                        removeUnderline
                      >
                        Resend invite
                      </Link>
                    );
                  },
                },
              ]}
            />
          </Card>
        </Layout.Section>
      </Layout>
      <Modal
        title="Invite team member"
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      >
        <AutoForm
          action={api.invite.create}
          onSuccess={() => setShowInviteModal(false)}
        >
          <Modal.Section>
            <AutoEmailInput field="email" placeholder="" />
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
                <Button onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <AutoSubmit variant="primary">Send invite</AutoSubmit>
              </ButtonGroup>
            </div>
          </Modal.Section>
        </AutoForm>
      </Modal>
      {resendInviteMessage && <Toast content={resendInviteMessage.message} error={resendInviteMessage.isError} onDismiss={() => setResendInviteMessage(null)} />}
    </Page>
  );
}
