import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { FormValues } from '../schema';

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
}

export default function StepDocuments({ register, errors, watch }: Props) {
  const resume = watch('resume');
  const photo = watch('photo');

  return (
    <div>
      <h2>Documents</h2>

      <div className="field">
        <label htmlFor="resume">Resume (PDF or Word, max 5MB)</label>
        <input
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          {...register('resume')}
          aria-invalid={!!errors.resume}
          aria-describedby={errors.resume ? 'resume-error' : undefined}
        />
        {resume && resume.length > 0 && <p className="hint">Selected: {resume[0].name}</p>}
        {errors.resume && (
          <p id="resume-error" className="error-text" role="alert">
            {errors.resume.message as string}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="photo">Profile photo (JPG or PNG, optional, max 5MB)</label>
        <input
          id="photo"
          type="file"
          accept=".jpg,.jpeg,.png"
          {...register('photo')}
          aria-invalid={!!errors.photo}
          aria-describedby={errors.photo ? 'photo-error' : undefined}
        />
        {photo && photo.length > 0 && <p className="hint">Selected: {photo[0].name}</p>}
        {errors.photo && (
          <p id="photo-error" className="error-text" role="alert">
            {errors.photo.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
