import Navbar from "../components/navbar";

export default function Layout({ children }) {
  return (
    <Navbar>
      <div className="layout">{children}</div>
    </Navbar>
  );
}
