import { useState } from "react";

import type {
  ShippingAddress,
} from "../machine/checkout.types";

interface ShippingStepProps {
  onSubmit: (
    address: ShippingAddress
  ) => void;

  onBack: () => void;
}

const initialForm: ShippingAddress = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

export default function ShippingStep({
  onSubmit,
  onBack,
}: ShippingStepProps) {
  const [form, setForm] =
    useState<ShippingAddress>(
      initialForm
    );

  const [error, setError] =
    useState("");

  function handleChange(
    field: keyof ShippingAddress,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode ||
      !form.phone
    ) {
      setError(
        "Please fill all shipping fields."
      );

      return;
    }

    onSubmit(form);
  }

  return (
    <section>

      <h2>
        Shipping Information
      </h2>

      <p>
        Enter your delivery information
        below.
      </p>

      {/* Validation Error */}

      {error && (
        <div
          className="error-box"
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
      >

        <div className="form-grid">

          {/* First Name */}

          <div className="form-group">

            <label htmlFor="firstName">
              First Name
            </label>

            <input
              id="firstName"
              type="text"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={(event) =>
                handleChange(
                  "firstName",
                  event.target.value
                )
              }
            />

          </div>

          {/* Last Name */}

          <div className="form-group">

            <label htmlFor="lastName">
              Last Name
            </label>

            <input
              id="lastName"
              type="text"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={(event) =>
                handleChange(
                  "lastName",
                  event.target.value
                )
              }
            />

          </div>

          {/* Address */}

          <div className="form-group full-width">

            <label htmlFor="address">
              Address
            </label>

            <input
              id="address"
              type="text"
              placeholder="Enter your full address"
              value={form.address}
              onChange={(event) =>
                handleChange(
                  "address",
                  event.target.value
                )
              }
            />

          </div>

          {/* City */}

          <div className="form-group">

            <label htmlFor="city">
              City
            </label>

            <input
              id="city"
              type="text"
              placeholder="Enter city"
              value={form.city}
              onChange={(event) =>
                handleChange(
                  "city",
                  event.target.value
                )
              }
            />

          </div>

          {/* State */}

          <div className="form-group">

            <label htmlFor="state">
              State
            </label>

            <input
              id="state"
              type="text"
              placeholder="Enter state"
              value={form.state}
              onChange={(event) =>
                handleChange(
                  "state",
                  event.target.value
                )
              }
            />

          </div>

          {/* Pincode */}

          <div className="form-group">

            <label htmlFor="pincode">
              Pincode
            </label>

            <input
              id="pincode"
              type="text"
              inputMode="numeric"
              placeholder="Enter pincode"
              value={form.pincode}
              onChange={(event) =>
                handleChange(
                  "pincode",
                  event.target.value
                )
              }
            />

          </div>

          {/* Phone */}

          <div className="form-group">

            <label htmlFor="phone">
              Phone
            </label>

            <input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={(event) =>
                handleChange(
                  "phone",
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* Form Actions */}

        <div className="checkout-actions">

          <button
            className="btn btn-secondary"
            type="button"
            onClick={onBack}
          >
            ← Back to Cart
          </button>

          <button
            className="btn btn-primary"
            type="submit"
          >
            Continue to Payment →
          </button>

        </div>

      </form>

    </section>
  );
}