import { useEffect } from "react";
import { useCurrentuser } from "../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useCurrentuser();

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate("/");
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) return <Spinner />;

  if (isAdmin) return children;
}

export default ProtectedRoute;
