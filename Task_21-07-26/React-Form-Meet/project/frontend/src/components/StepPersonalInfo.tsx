import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormValues } from '../schema';

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export default function StepPersonalInfo({ register, errors }: Props) {
  return (
    <div>
      <h2>Personal Info</h2>

      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          type="text"
          {...register('fullName')}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" className="error-text" role="alert">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="error-text" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="phone">Phone number</label>
        <input
          id="phone"
          type="tel"
          placeholder="e.g. 9876543210"
          {...register('phone')}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="error-text" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="dob">Date of birth</label>
        <input
          id="dob"
          type="date"
          {...register('dob')}
          aria-invalid={!!errors.dob}
          aria-describedby={errors.dob ? 'dob-error' : undefined}
        />
        {errors.dob && (
          <p id="dob-error" className="error-text" role="alert">
            {errors.dob.message}
          </p>
        )}
      </div>
    </div>
  );
}
