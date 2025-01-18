import { EmailIcon, ExitIcon, ListNumberedIcon, ProfileIcon, TeamIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { Frame, Navigation, TopBar } from "@shopify/polaris";
import { useSignOut } from "@gadgetinc/react";
import { ToastManager } from "../components/ToastManager";
import type { RootOutletContext } from "../root";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { session, gadgetConfig } = context;

  const userId = session?.get("user");
  const user = userId ? await context.api.user.findOne(userId) : undefined;

  if (!user) {
    return redirect(gadgetConfig.authentication!.signInPath);
  }

  return json({
    user,
  });
};

export type AuthOutletContext = RootOutletContext & {
  user: any;
};

const UserMenu = () => {
  const { user } = useLoaderData<typeof loader>();
  const [userMenuActive, setUserMenuActive] = useState(false);
  const signOut = useSignOut();

  return (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            { content: "Profile", url: "/profile", icon: ProfileIcon },
            { content: "Team", url: "/team", icon: TeamIcon },
            { content: "Invite", url: "/invite", icon: EmailIcon },
            { content: "Sign out", icon: ExitIcon, onAction: signOut },
          ],
        },
      ]}
      name={user.firstName ?? user.email}
      avatar={user.profilePicture?.url}
      initials={
        (user.firstName?.slice(0, 1) ?? "") + (user.lastName?.slice(0, 1) ?? "")
      }
      open={userMenuActive}
      onToggle={() => setUserMenuActive((value) => !value)}
    />
  );
};

export default function() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();
  const rootOutletContext = useOutletContext<RootOutletContext>();

  return (
   <Frame
  topBar={
    <>
      <div className="navbar-logo">SimplyQ</div>
      <TopBar userMenu={<UserMenu />} />
    </>
  }
>
  <Outlet context={{ ...rootOutletContext, user } as AuthOutletContext} />
  <ToastManager />
</Frame>



  );
}