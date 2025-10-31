import MainNavigationBar from "./MainNavigationBar";
import { useLocation } from "react-router-dom";

export default function ConditionalNavigation() {
  const location = useLocation();
  const pathname = location.pathname;

  const hideNavigation =
    pathname === "/login" || pathname === "/register" || pathname === "/debug-auth";

  if (hideNavigation) {
    return null;
  }

  return <MainNavigationBar />;
}

