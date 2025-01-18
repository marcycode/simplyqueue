import { 
  BlockStack, 
  Page, 
  Card, 
  Text, 
  Banner,
  FormLayout,
  TextField,
  Button
} from "@shopify/polaris";
import { useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";
import { useAction } from "@gadgetinc/react";
import { api } from "../api";

export default function QueueSignUp() {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Action for creating queue membership
  const [{ fetching: joiningQueue }, joinQueue] = useAction(api.queueMembership.create);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(undefined);
    
    try {
      // Create queue membership directly with user details
      const joinQueueResult = await joinQueue({
        queueMembership: {
          queue: { _link: queueId },
          firstName,
          lastName,
          email
        }
      });

      if (joinQueueResult.error) {
        throw joinQueueResult.error;
      }

      // Navigate to the join page
      if (joinQueueResult.data?.id) {
        navigate(`/queues/${queueId}/join/${joinQueueResult.data.id}`);
      } else {
        throw new Error("Failed to join queue");
      }
    } catch (error: any) {
      setError(error.message || "Failed to join queue. Please try again.");
      console.error("Join queue error:", error);
    }
  };

  return (
    <Page narrowWidth>
      <BlockStack gap="400">
        {error && (
          <Banner status="critical" onDismiss={() => setError(undefined)}>
            {error}
          </Banner>
        )}
        <Card roundedAbove="sm">
          <BlockStack gap="400">
            <Text as="h1" variant="headingLg">
              Join the queue
            </Text>
            <form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  label="First name"
                  value={firstName}
                  onChange={setFirstName}
                  autoComplete="given-name"
                  required
                />
                <TextField
                  label="Last name"
                  value={lastName}
                  onChange={setLastName}
                  autoComplete="family-name"
                  required
                />
                <TextField
                  type="email"
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                  required
                />
                <Button 
                  submit 
                  variant="primary"
                  loading={joiningQueue}
                >
                  Join queue
                </Button>
              </FormLayout>
            </form>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
