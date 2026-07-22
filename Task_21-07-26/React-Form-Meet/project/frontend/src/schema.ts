import { z } from 'zod';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb
const RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const IMAGE_TYPES = ['image/jpeg', 'image/png'];

function calculateAge(dobString: string) {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  year: z.coerce
    .number({ invalid_type_error: 'Year is required' })
    .int()
    .min(1950, 'Year looks too old')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
});

export const formSchema = z
  .object({
    // step 1 - personal info
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^[0-9+\-\s()]{7,15}$/, 'Enter a valid phone number'),
    dob: z
      .string()
      .min(1, 'Date of birth is required')
      .refine((val) => calculateAge(val) >= 16, 'You must be at least 16 years old'),

    // step 2 - background (conditional)
    employmentStatus: z.enum(['employed', 'student', 'unemployed'], {
      errorMap: () => ({ message: 'Please select your current status' }),
    }),
    companyName: z.string().optional(),
    jobTitle: z.string().optional(),
    schoolName: z.string().optional(),
    graduationYear: z.coerce.number().optional(),

    // step 3 - dynamic list
    certifications: z.array(certificationSchema).optional(),

    // step 4 - files
    resume: z
      .custom<FileList>()
      .refine((files) => files && files.length === 1, 'Resume is required')
      .refine((files) => !files || files[0]?.size <= MAX_FILE_SIZE, 'Resume must be under 5MB')
      .refine(
        (files) => !files || RESUME_TYPES.includes(files[0]?.type),
        'Only PDF or Word documents are allowed'
      ),
    photo: z
      .custom<FileList>()
      .optional()
      .refine((files) => !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE, 'Photo must be under 5MB')
      .refine(
        (files) => !files || files.length === 0 || IMAGE_TYPES.includes(files[0]?.type),
        'Only JPG or PNG images are allowed'
      ),
  })
  // conditional validation depending on employment status
  .superRefine((data, ctx) => {
    if (data.employmentStatus === 'employed') {
      if (!data.companyName || data.companyName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['companyName'],
          message: 'Company name is required',
        });
      }
      if (!data.jobTitle || data.jobTitle.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['jobTitle'],
          message: 'Job title is required',
        });
      }
    }

    if (data.employmentStatus === 'student') {
      if (!data.schoolName || data.schoolName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['schoolName'],
          message: 'School name is required',
        });
      }
      if (!data.graduationYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['graduationYear'],
          message: 'Expected graduation year is required',
        });
      }
    }
  });

export type FormValues = z.infer<typeof formSchema>;

export const stepFields: Record<number, (keyof FormValues)[]> = {
  0: ['fullName', 'email', 'phone', 'dob'],
  1: ['employmentStatus', 'companyName', 'jobTitle', 'schoolName', 'graduationYear'],
  2: ['certifications'],
  3: ['resume', 'photo'],
  4: [],
};

export const STEP_LABELS = ['Personal Info', 'Background', 'Certifications', 'Documents', 'Review'];
