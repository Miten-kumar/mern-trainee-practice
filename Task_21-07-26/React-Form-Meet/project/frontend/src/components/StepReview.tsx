import { UseFormWatch } from 'react-hook-form';
import { FormValues } from '../schema';

interface Props {
  watch: UseFormWatch<FormValues>;
  submitting: boolean;
  submitError: string | null;
}

export default function StepReview({ watch, submitting, submitError }: Props) {
  const values = watch();

  return (
    <div>
      <h2>Review your application</h2>
      <p className="hint">Check everything looks right before submitting.</p>

      <div className="review-section">
        <h3>Personal Info</h3>
        <p>
          <strong>Name:</strong> {values.fullName}
        </p>
        <p>
          <strong>Email:</strong> {values.email}
        </p>
        <p>
          <strong>Phone:</strong> {values.phone}
        </p>
        <p>
          <strong>Date of birth:</strong> {values.dob}
        </p>
      </div>

      <div className="review-section">
        <h3>Background</h3>
        <p>
          <strong>Status:</strong> {values.employmentStatus}
        </p>
        {values.employmentStatus === 'employed' && (
          <>
            <p>
              <strong>Company:</strong> {values.companyName}
            </p>
            <p>
              <strong>Job title:</strong> {values.jobTitle}
            </p>
          </>
        )}
        {values.employmentStatus === 'student' && (
          <>
            <p>
              <strong>School:</strong> {values.schoolName}
            </p>
            <p>
              <strong>Graduation year:</strong> {values.graduationYear}
            </p>
          </>
        )}
      </div>

      <div className="review-section">
        <h3>Certifications</h3>
        {!values.certifications || values.certifications.length === 0 ? (
          <p className="hint">None added</p>
        ) : (
          <ul>
            {values.certifications.map((cert, i) => (
              <li key={i}>
                {cert.name} ({cert.year})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="review-section">
        <h3>Documents</h3>
        <p>
          <strong>Resume:</strong> {values.resume?.[0]?.name || 'not selected'}
        </p>
        <p>
          <strong>Photo:</strong> {values.photo?.[0]?.name || 'not selected'}
        </p>
      </div>

      {submitError && (
        <p className="error-banner" role="alert">
          {submitError}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit application'}
      </button>
    </div>
  );
}
