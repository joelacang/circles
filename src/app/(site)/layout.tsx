"use client";

import WelcomeScreen from "@/features/docs/components/welcome-screen";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import AuthenticatedLayoutPage from "./authenticated-layout";
import { init } from "emoji-mart";
import data from "@emoji-mart/data";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  init({ data });

  return (
    <main>
      <Authenticated>
        <AuthenticatedLayoutPage>{children}</AuthenticatedLayoutPage>
      </Authenticated>
      <Unauthenticated>
        <WelcomeScreen />
      </Unauthenticated>
    </main>
  );
};

export default SiteLayout;
