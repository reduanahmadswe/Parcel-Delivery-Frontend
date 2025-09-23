import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="flex items-center space-x-4">
      <Link to="/">Home</Link>
      <Link to="/track">Track</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}

