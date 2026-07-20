import { useEffect, useState } from "react";
import {  User } from "../types/user.types";

interface UserFormProps {
  initialData?: User | null;
  onSubmit: (data: Omit<User, "id">) => void;
  onCancel?: () => void;
}

const UserForm = ({
  initialData,
  onSubmit,
  onCancel,
}: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(formData);

    if (!initialData) {
      setFormData({
        name: "",
        email: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialData ? "Update User" : "Create User"}</h3>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {initialData ? "Update" : "Create"}
      </button>

      {initialData && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default UserForm;