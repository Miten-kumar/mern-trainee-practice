import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues, stepFields, STEP_LABELS } from './schema';
import { saveProgress, loadProgress, clearProgress } from './hooks/useFormPersist';
import { submitApplication } from './api';
import ProgressBar from './components/ProgressBar';
import StepPersonalInfo from './components/StepPersonalInfo';
import StepBackground from './components/StepBackground';
import StepCertifications from './components/StepCertifications';
import StepDocuments from './components/StepDocuments';
import StepReview from './components/StepReview';

const saved = loadProgress();

export default function App() {
  const [currentStep, setCurrentStep] = useState(saved?.step || 0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      certifications: [],
      ...(saved?.values || {}),
    } as Partial<FormValues>,
  });

  const employmentStatus = watch('employmentStatus');
  const watchedValues = watch();

  // save progress to localStorage whenever something changes (debounced a bit)
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveProgress(currentStep, watchedValues);
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedValues), currentStep]);

  // move focus to the step heading when step changes, helps screen reader users
  useEffect(() => {
    headingRef.current?.focus();
  }, [currentStep]);

  const goNext = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const valid = await trigger(fieldsToValidate);
    if (valid) {
      setCurrentStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
    }
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('dob', data.dob);
      formData.append('employmentStatus', data.employmentStatus);
      if (data.companyName) formData.append('companyName', data.companyName);
      if (data.jobTitle) formData.append('jobTitle', data.jobTitle);
      if (data.schoolName) formData.append('schoolName', data.schoolName);
      if (data.graduationYear) formData.append('graduationYear', String(data.graduationYear));
      formData.append('certifications', JSON.stringify(data.certifications || []));
      if (data.resume?.[0]) formData.append('resume', data.resume[0]);
      if (data.photo?.[0]) formData.append('photo', data.photo[0]);

      await submitApplication(formData);
      setSubmitted(true);
      clearProgress();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong, please try again');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-container">
        <div className="success-message" role="status">
          <h1>Application submitted!</h1>
          <p>Thanks for applying. We'll get back to you over email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>Job Application</h1>
      <ProgressBar currentStep={currentStep} />

      {/* announces the current step to screen readers */}
      <p className="sr-only" aria-live="polite">
        Step {currentStep + 1} of {STEP_LABELS.length}: {STEP_LABELS[currentStep]}
      </p>

      <form
        onSubmit={currentStep === STEP_LABELS.length - 1 ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
        noValidate
      >
        {/* hidden focus target so heading gets focused on step change, keeps h2 in each step component */}
        <span ref={headingRef} tabIndex={-1} style={{ outline: 'none' }} />

        {currentStep === 0 && <StepPersonalInfo register={register} errors={errors} />}
        {currentStep === 1 && (
          <StepBackground register={register} errors={errors} employmentStatus={employmentStatus} />
        )}
        {currentStep === 2 && <StepCertifications control={control} register={register} errors={errors} />}
        {currentStep === 3 && <StepDocuments register={register} errors={errors} watch={watch} />}
        {currentStep === 4 && <StepReview watch={watch} submitting={submitting} submitError={submitError} />}

        <div className="form-nav">
          <button type="button" className="btn btn-secondary" onClick={goBack} disabled={currentStep === 0}>
            Back
          </button>
          {currentStep < STEP_LABELS.length - 1 && (
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
