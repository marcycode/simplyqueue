import { useFormContext } from "@gadgetinc/react";
import { useAutoFormMetadata } from "@gadgetinc/react/auto/polaris";
import { useBlocker } from "@remix-run/react";
import { ContextualSaveBar } from "@shopify/polaris";
import { useEffect, useState } from "react";
import "./global.css";

export const AutoSaveBar = () => {
  const {
    formState: { dirtyFields, isLoading },
    reset,
  } = useFormContext();
  const autoform = useAutoFormMetadata();
  const dirtyKeys = Object.keys(dirtyFields);
  const [blockCount, setBlockCount] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const shaking = blockCount != shakeCount;

  // Block navigating elsewhere when data has been entered into the input
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const shouldBlock =
      dirtyKeys.length > 0 &&
      !autoform.submitResult.isSubmitting &&
      !autoform.submitResult.isSuccessful &&
      currentLocation.pathname !== nextLocation.pathname;
    if (shouldBlock) {
      setBlockCount((blockCount) => blockCount + 1);
    }
    return shouldBlock;
  });

  // Shake the label for a short time after any navigation is blocked
  useEffect(() => {
    if (blocker.state == "blocked" && shakeCount != blockCount) {
      const timeout = setTimeout(() => setShakeCount(blockCount), 700);
      return () => clearTimeout(timeout);
    }
  }, [blocker.state, shakeCount, blockCount]);

  // Unblock navigation when the form is no longer dirty, or submitted
  useEffect(() => {
    if (blocker.state == "blocked" && (dirtyKeys.length == 0 || autoform.submitResult.isSubmitting || autoform.submitResult.isSuccessful)) {
      blocker.reset();
      setShakeCount(blockCount);
    }
  }, [blocker.state, dirtyKeys.length, autoform.submitResult.isSubmitting, autoform.submitResult.isSuccessful]);

  if (dirtyKeys.length == 0) {
    return null;
  }

  return (
    <ContextualSaveBar
      message={
        (
          <div
            style={{
              padding: "0px 1em",
              transition: "color 0.2s ease-in-out",
              animation: shaking ? "horizontal-shake 0.25s ease-in-out infinite" : undefined,
              color: blocker.state == "blocked" ? "#cf9a00" : undefined,
            }}
          >
            Unsaved changes
          </div>
        ) as any
      }
      saveAction={{
        onAction: () => {
          blocker.reset?.();
          autoform.submit();
        },
        loading: isLoading || autoform.submitResult.isSubmitting,
        disabled: autoform.submitResult.isSubmitting,
      }}
      discardAction={{
        onAction: () => {
          blocker.reset?.();
          reset();
        },
      }}
    />
  );
};
