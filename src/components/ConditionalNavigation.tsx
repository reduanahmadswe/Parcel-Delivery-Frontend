"use client";

import MainNavigationBar from "@/components/MainNavigationBar";
import { usePathname } from "next/navigation";

export default function ConditionalNavigation() {
  const pathname = usePathname();

  // Hide navigation on authentication pages
  const hideNavigation = pathname === "/login" || pathname === "/register";

  if (hideNavigation) {
    return null;
  }

  return <MainNavigationBar />;
}
