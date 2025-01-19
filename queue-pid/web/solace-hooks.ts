import { useEffect, useCallback, useRef, useState } from 'react';
import solace from 'solclientjs';

function useBaseSolaceSession() {
  const sessionRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const factoryProps = new solace.SolclientFactoryProperties();
    factoryProps.profile = solace.SolclientFactoryProfiles.version10;
    solace.SolclientFactory.init(factoryProps);

    const session = solace.SolclientFactory.createSession({
      url: import.meta.env.VITE_SOLACE_URL,
      vpnName: import.meta.env.SOLACE_VPN,
      userName: import.meta.env.SOLACE_USER_NAME,
      password: import.meta.env.SOLACE_PASSWORD,
    });

    sessionRef.current = session;

    try {
      session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, (sessionEvent) =>
        console.error(`Cannot subscribe to topic: ${sessionEvent}`)
      );
      session.on(solace.SessionEventCode.SUBSCRIPTION_OK, () => {
        console.log("Subscription OK!!");
      });
      session.on(solace.SessionEventCode.UP_NOTICE, () => {
        console.log("=== Successfully connected and ready to publish/subscribe. ===");
        setIsConnected(true);
      });
      session.on(solace.SessionEventCode.DISCONNECTED, () => {
        setIsConnected(false);
      });

      session.connect();
    } catch (error) {
      console.error("!!! Solace error !!!");
      console.error(error);
      setIsConnected(false);
    }

    return () => {
      if (sessionRef.current) {
        try {
          sessionRef.current.disconnect();
          sessionRef.current = null;
          setIsConnected(false);
        } catch (error) {
          console.error("Error disconnecting Solace session:", error);
        }
      }
    };
  }, []);

  return { sessionRef, isConnected };
}

export function useSolacePublish() {
  const { sessionRef, isConnected } = useBaseSolaceSession();

  const publish = useCallback((memberId: string, msgText: string = "Test") => {
    if (!sessionRef.current || !isConnected) {
      console.log("Session not ready — cannot publish message.");
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
  }, [isConnected]);

  return { publish, isConnected };
}

export function useSolaceSubscribe() {
  const { sessionRef, isConnected } = useBaseSolaceSession();

  const subscribe = useCallback((memberId: string) => {
    if (!sessionRef.current || !isConnected) {
      console.log("Session not ready — cannot subscribe.");
      return;
    }

    try {
      sessionRef.current.subscribe(
        solace.SolclientFactory.createTopicDestination("ready/" + memberId),
        true,
        "ready",
        10000
      );
    } catch (error) {
      console.error("!!!! error in subscribe function !!!!");
      console.error(error);
    }
  }, [isConnected]);

  return { subscribe, isConnected };
}
