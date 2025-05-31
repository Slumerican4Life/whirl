
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to enhanced login
    navigate("/enhanced-login", { replace: true });
  }, [navigate]);

  return null;
};

export default LoginPage;
