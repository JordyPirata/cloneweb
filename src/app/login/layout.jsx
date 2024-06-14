import { ProtectedRoute } from "../lib/context/ProtectedRoute";

export default function Layout({ children }) {
  return (
    <ProtectedRoute login={true}>
      <div className="layout">{children}</div>
    </ProtectedRoute>
  );
}
