import { useState,  type FormEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { login } from "../api/graphqlApi";
import './pages.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    "bhoomi@example.com"
  );

  const [password, setPassword] = useState(
    "password123"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(email, password);

      navigate("/graphql-users");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>GraphQL Login</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;