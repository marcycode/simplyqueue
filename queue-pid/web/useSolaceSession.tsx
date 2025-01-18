import { useEffect, useCallback, useRef } from 'react';
import solace from 'solclientjs';

export function useSolaceSession() {
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Solace factory
    const factoryProps = new solace.SolclientFactoryProperties();
    factoryProps.profile = solace.SolclientFactoryProfiles.version10;
    solace.SolclientFactory.init(factoryProps);

    // Create session
    const session = solace.SolclientFactory.createSession({
      url: import.meta.env.VITE_SOLACE_URL,
      vpnName: process.env.SOLACE_VPN,
      userName: process.env.SOLACE_USER_NAME,
      password: process.env.SOLACE_PASSWORD,
    });

    // Store session in ref
    sessionRef.current = session;

    try {
      session.connect();

      session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, (sessionEvent) =>
        console.error(`Cannot subscribe to topic: ${sessionEvent}`)
      );
      session.on(solace.SessionEventCode.SUBSCRIPTION_OK, () => {
        console.log("Subscription OK!!");
      });
      session.on(solace.SessionEventCode.UP_NOTICE, () => {
        console.log("=== Successfully connected and ready to publish. ===");
      });
    } catch (error) {
      console.error("!!! Solace error !!!");
      console.error(error);
    }

    // Cleanup on unmount
    return () => {
      if (sessionRef.current) {
        try {
          sessionRef.current.disconnect();
          sessionRef.current = null;
        } catch (error) {
          console.error("Error disconnecting Solace session:", error);
        }
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  const publish = useCallback((memberId: string, msgText: string = "Test") => {
    if (!sessionRef.current) {
      console.log("Session does not exist — cannot publish message.");
      return;
    }

    const msg = solace.SolclientFactory.createMessage();
    msg.setDestination(
      solace.SolclientFactory.createTopicDestination(`ready/${memberId}`)
    );
    msg.setBinaryAttachment(msgText);
    msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);

    try {
      sessionRef.current.send(msg);
      console.log("Message published!!!");
    } catch (error) {
      console.error("!!! Message failed to publish !!!");
      console.error(error);
    }
  }, []);

  return { publish };
}
