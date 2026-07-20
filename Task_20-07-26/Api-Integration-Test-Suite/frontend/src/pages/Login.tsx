import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await authService.login(
        formData
      );


      login(
        response.token,
        response.user
      );


      navigate("/users");

    } catch (err: any) {

      setError(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2>
        Login
      </h2>


      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}


      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />


        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />


        <button type="submit">
          {loading ? "Logging..." : "Login"}
        </button>

      </form>

    </div>
  );
};


export default Login;