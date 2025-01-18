import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { RootOutletContext } from "../root";

export const loader: LoaderFunction = async ({ context }) => {
  const { session, gadgetConfig } = context;

  if (!!session?.get("user")) {
    // redirect already logged in users to the app experience
    return redirect("/readme");
  } else {
    // redirect unauthenticated users to the sign-in page
    return redirect(gadgetConfig.authentication.signInPath);
  }
};

export default function () {
  return null;
}