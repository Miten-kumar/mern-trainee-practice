import {
  FormEvent,
  useState,
} from "react";

import {
  createUser,
} from "../api/userApi";

import type {
  User,
} from "../types/user";

interface UserFormProps {
  onUserCreated: (
    user: User
  ) => void;
}

interface FormState {
  name: string;
  email: string;
  age: string;
  password: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  age: "",
  password: "",
};

export function UserForm({
  onUserCreated,
}: UserFormProps) {
  const [form, setForm] =
    useState<FormState>(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const user =
        await createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          age: Number(form.age),
          password: form.password,
        });

      onUserCreated(user);

      setForm(initialForm);

      setSuccess(
        "User created successfully."
      );
    } catch (error: any) {
      const validationErrors =
        error.response?.data?.errors;

      if (
        Array.isArray(validationErrors)
      ) {
        const messages =
          validationErrors.map(
            (item: {
              property: string;
              message: string;
            }) =>
              `${item.property}: ${item.message}`
          );

        setError(
          messages.join("\n")
        );
      } else {
        setError(
          error.response?.data?.message ??
            "Unable to create user."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="user-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2>Create User</h2>

      <div className="form-group">
        <label htmlFor="name">
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter name"
          autoComplete="name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="age">
          Age
        </label>

        <input
          id="age"
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          placeholder="Enter age"
          min={18}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password@123"
          autoComplete="new-password"
        />
      </div>

      {error && (
        <div
          className="error"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="success"
          role="status"
          aria-live="polite"
        >
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Creating..."
          : "Create User"}
      </button>
    </form>
  );
}