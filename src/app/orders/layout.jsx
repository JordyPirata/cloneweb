import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import { ProtectedRoute } from "../lib/context/ProtectedRoute";

export default function Layout({ children }) {
  return (
    <ProtectedRoute login={false}>
      <Navbar>
        <div className="layout">{children}</div>
      </Navbar>
      <Footer />
    </ProtectedRoute>
  );
}
