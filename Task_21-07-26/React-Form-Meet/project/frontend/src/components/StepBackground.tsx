import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormValues } from '../schema';

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  employmentStatus: string | undefined;
}

export default function StepBackground({ register, errors, employmentStatus }: Props) {
  return (
    <div>
      <h2>Background</h2>

      <fieldset className="field">
        <legend>What's your current status?</legend>
        <div className="radio-group">
          <label>
            <input type="radio" value="employed" {...register('employmentStatus')} />
            Employed
          </label>
          <label>
            <input type="radio" value="student" {...register('employmentStatus')} />
            Student
          </label>
          <label>
            <input type="radio" value="unemployed" {...register('employmentStatus')} />
            Not currently working
          </label>
        </div>
        {errors.employmentStatus && (
          <p className="error-text" role="alert">
            {errors.employmentStatus.message}
          </p>
        )}
      </fieldset>

      {/* conditional fields - only shown (and required) when employed */}
      {employmentStatus === 'employed' && (
        <>
          <div className="field">
            <label htmlFor="companyName">Company name</label>
            <input
              id="companyName"
              type="text"
              {...register('companyName')}
              aria-invalid={!!errors.companyName}
              aria-describedby={errors.companyName ? 'companyName-error' : undefined}
            />
            {errors.companyName && (
              <p id="companyName-error" className="error-text" role="alert">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="jobTitle">Job title</label>
            <input
              id="jobTitle"
              type="text"
              {...register('jobTitle')}
              aria-invalid={!!errors.jobTitle}
              aria-describedby={errors.jobTitle ? 'jobTitle-error' : undefined}
            />
            {errors.jobTitle && (
              <p id="jobTitle-error" className="error-text" role="alert">
                {errors.jobTitle.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* conditional fields - only shown (and required) when student */}
      {employmentStatus === 'student' && (
        <>
          <div className="field">
            <label htmlFor="schoolName">School / University name</label>
            <input
              id="schoolName"
              type="text"
              {...register('schoolName')}
              aria-invalid={!!errors.schoolName}
              aria-describedby={errors.schoolName ? 'schoolName-error' : undefined}
            />
            {errors.schoolName && (
              <p id="schoolName-error" className="error-text" role="alert">
                {errors.schoolName.message}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="graduationYear">Expected graduation year</label>
            <input
              id="graduationYear"
              type="number"
              {...register('graduationYear')}
              aria-invalid={!!errors.graduationYear}
              aria-describedby={errors.graduationYear ? 'graduationYear-error' : undefined}
            />
            {errors.graduationYear && (
              <p id="graduationYear-error" className="error-text" role="alert">
                {errors.graduationYear.message}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
