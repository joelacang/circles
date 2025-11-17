"use client";

import WelcomeScreen from "@/features/docs/components/welcome-screen";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import AuthenticatedLayoutPage from "./authenticated-layout";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
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
