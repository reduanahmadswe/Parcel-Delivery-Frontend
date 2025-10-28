import MainNavigationBar from "./MainNavigationBar";
import { useLocation } from "react-router-dom";

export default function ConditionalNavigation() {
  const location = useLocation();
  const pathname = location.pathname;

  // Hide navigation on authentication pages
  const hideNavigation = pathname === "/login" || pathname === "/register";

  if (hideNavigation) {
    return null;
  }

  return <MainNavigationBar />;
}

