import Navbar from "../components/navbar";
import { ProtectedRoute } from "../lib/context/ProtectedRoute";

export default function Layout({ children }) {
  return (
    <ProtectedRoute login={false} admin={true}>
      <Navbar>
        <div className="layout">{children}</div>
      </Navbar>
    </ProtectedRoute>
  );
}
