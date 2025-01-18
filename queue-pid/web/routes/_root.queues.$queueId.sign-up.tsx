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
import { useState, useRef, useCallback } from "react";
import { useAction } from "@gadgetinc/react";
import Webcam from "react-webcam";
import { api } from "../api";

export default function QueueSignUp() {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userImage, setUserImage] = useState("");

  // Action for creating queue membership
  const [{ fetching: joiningQueue }, joinQueue] = useAction(api.queueMembership.create);

  const WebcamCapture = () => {
    const webcamRef = useRef<Webcam>(null);

    const capture = useCallback(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setUserImage(imageSrc);
      }
    }, [webcamRef]);

    return (
      <BlockStack gap="200">
        {!userImage && (
          <> 
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <Button onClick={capture}>Take photo</Button>
          </>
        )}
        {userImage && (
          <> 
            <img
              src={userImage}
              alt="captured"
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <Button onClick={() => setUserImage("")}>Retake</Button>
          </>
        )}
      </BlockStack>
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(undefined);

    try {
      const result = await joinQueue({
        queue: { _link: queueId },
        firstName,
        lastName,
        email,
        userImage
      });

      if (!result.data) {
        throw new Error("Failed to create queue membership");
      }

      if (result.data.id) {
        navigate(`/queues/${queueId}/join/${result.data.id}`);
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
                <WebcamCapture />
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