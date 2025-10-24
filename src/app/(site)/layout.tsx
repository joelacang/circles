"use client";
import Sidebar from "@/features/sidebar/components";
import WelcomeScreen from "@/features/docs/components/welcome-screen";
import { useIsMobile } from "@/hooks/use-mobile";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <main>
      <Authenticated>
        <div className="flex flex-row h-screen ">
          {!isMobile && (
            <div className="w-xs border-r">
              <Sidebar />
            </div>
          )}
          <div className="flex flex-1 justify-center w-full overflow-y-auto h-full">
            <div className="max-w-2xl  w-full">{children}</div>
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <WelcomeScreen />
      </Unauthenticated>
    </main>
  );
};

export default SiteLayout;
