"use client";
import Sidebar from "@/features/navigation/components";
import WelcomeScreen from "@/features/docs/components/welcome-screen";
import { useIsMobile } from "@/hooks/use-mobile";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import TopNavbar from "@/features/navigation/components/top-navbar";
import { cn } from "@/lib/utils";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <main>
      <Authenticated>
        <div className="flex relative flex-row h-screen ">
          {isMobile ? (
            <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 py-2 px-4 absolute top-0 z-20 border-b backdrop-blur w-full">
              <TopNavbar />
            </div>
          ) : (
            <div className="w-xs border-r z-[60]">
              <Sidebar />
            </div>
          )}
          <div
            className={cn(
              "flex flex-1 justify-center w-full overflow-y-auto h-full",
              isMobile && " pt-12"
            )}
          >
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
