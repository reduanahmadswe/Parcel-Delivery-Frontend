import ConditionalNavigation from "./Navigation/ConditionalNavigation";
import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <ConditionalNavigation />
      <main>{children}</main>
    </div>
  );
}

