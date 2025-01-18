import { Toast, ToastProps } from "@shopify/polaris";
import { useEffect, useState } from "react";

/**
 * Imperatively show a toast. Wraps the Polaris <Toast/> component but allows showing one from wherever, instead of having to manually manage mounting and unmounting the toast.
 */
export const toast = (props: Partial<ToastProps>) => {
  if (!props.content) return;

  ref.setToast({
    onDismiss() {
      ref.setToast(null);
    },
    content: props.content!,
    ...props,
  });

  setTimeout(() => ref.setToast(null), props.duration ?? 3000);
};

/**
 * Run a function and give the user feedback if it works or errors with toasts.
 */
export const runWithFeedback = async <T,>(fn: () => T | Promise<T>, successMessage?: string) => {
  try {
    await fn();
    if (successMessage) {
      toast({ content: successMessage });
    }
  } catch (error: any) {
    toast({ content: `Unexpected error: ${error.message}`, error: true });
  }
};

export function ToastManager() {
  const [props, setProps] = useState<ToastProps | null>(null);
  useEffect(() => {
    ref.setToast = (props: ToastProps | null) => {
      setProps(props);
    };
  }, []);

  return props ? <Toast {...props} /> : null;
}

const ref: { setToast: (props: ToastProps | null) => void } = {
  setToast: () => {
    throw new Error("setToast not initialized because ToastManager has not mounted");
  },
};
