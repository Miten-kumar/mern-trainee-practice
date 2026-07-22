import { Control, FieldErrors, UseFormRegister, useFieldArray } from 'react-hook-form';
import { FormValues } from '../schema';

interface Props {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export default function StepCertifications({ control, register, errors }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications',
  });

  return (
    <div>
      <h2>Certifications</h2>
      <p className="hint">Optional - add any certifications you have. You can skip this step.</p>

      {fields.length === 0 && <p className="hint">No certifications added yet.</p>}

      {fields.map((field, index) => (
        <div className="certification-item" key={field.id}>
          <div className="field">
            <label htmlFor={`certifications.${index}.name`}>Certification name</label>
            <input
              id={`certifications.${index}.name`}
              type="text"
              {...register(`certifications.${index}.name` as const)}
              aria-invalid={!!errors.certifications?.[index]?.name}
            />
            {errors.certifications?.[index]?.name && (
              <p className="error-text" role="alert">
                {errors.certifications[index]?.name?.message}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor={`certifications.${index}.year`}>Year obtained</label>
            <input
              id={`certifications.${index}.year`}
              type="number"
              {...register(`certifications.${index}.year` as const)}
              aria-invalid={!!errors.certifications?.[index]?.year}
            />
            {errors.certifications?.[index]?.year && (
              <p className="error-text" role="alert">
                {errors.certifications[index]?.year?.message}
              </p>
            )}
          </div>

          <button
            type="button"
            className="btn btn-danger"
            onClick={() => remove(index)}
            aria-label={`Remove certification ${index + 1}`}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => append({ name: '', year: new Date().getFullYear() })}
      >
        + Add certification
      </button>
    </div>
  );
}
