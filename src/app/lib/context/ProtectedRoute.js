"use client";
import { useRouter } from "next/navigation"; // Importa desde next/navigation
import { useAuth } from "../context/authContext";
import { auth, updateUserField } from "../firebase/firebase";
import { Navbar, Progress } from "@nextui-org/react";

export function ProtectedRoute({ children, login, admin }) {
  const router = useRouter();
  const { user, userDB, loading } = useAuth();

  if (loading) {
    return (
      <Navbar className="shadow-md rounded-2xl w-full items-center justify-center">
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Cargando..."
          className="w-full justify-center"
        />
      </Navbar>
    );
  }

  const handleEmailDistinction = async () => {
    if (user.email !== userDB.email) {
      await updateUserField(user.uid, "email", user.email);
    }
  };

  if (user && userDB) {
    handleEmailDistinction();
  }

  if (login) {
    if (user && user.emailVerified) {
      router.push("/"); // Utiliza router.push en lugar de return router.push
      return null; // Retorno nulo para evitar la renderización de los children antes de la redirección
    }
    return <>{children}</>;
  }

  if (admin && user) {
    if (user && user.emailVerified && userDB.userType === "admin") {
      return <>{children}</>;
    }
    alert("No tienes permisos para acceder a esta página");
    router.push("/");
    return null;
  }

  if (!user) {
    router.push("/login"); // Utiliza router.push en lugar de return router.push
    return null; // Retorno nulo para evitar la renderización de los children antes de la redirección
  }

  if (userDB.blocked === true) {
    alert("Tu cuenta ha sido bloqueada");
    auth.signOut();
    router.push("/login");
    return null;
  }

  if (!user.emailVerified) {
    if (login === true) {
      return <>{children}</>;
    }
    alert("Verifica tu correo electrónico para continuar");
    router.push("/login");
    return null;
  }

  return <>{children}</>;
}
