import { useFormContext } from "@gadgetinc/react";
import { AutoButton } from "@gadgetinc/react/auto/polaris";

export const AutoDeleteButton = (props: Parameters<typeof AutoButton>[0]) => {
  const { reset } = useFormContext();

  return (
    <AutoButton {...props} onAction={() => reset()} variant="primary" tone="critical">
      Delete
    </AutoButton>
  );
};
