import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { validateLogin } from "../utils/validation";
import { getErrorMessage } from "../utils/error";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setError("");

    const validationError =
      validateLogin(
        email,
        password
      );

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      setError(
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <section className="auth-card">

        <h1 className="auth-title">
          Security Audit
        </h1>

        <p className="auth-subtitle">
          Sign in to access the security dashboard.
        </p>

        {error && (
          <div
            className="error-message"
            role="alert"
          >
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </section>
    </main>
  );
};

export default Login;