import { describe, it, expect } from 'vitest';
import { formSchema } from './schema';

// FileList can't be constructed directly in tests, so we fake an
// array-like object that has the same shape our schema checks
// (length, and files[0].size / .type / .name)
function makeFileList(files: { name: string; type: string; size: number }[]) {
  const fileList: any = { length: files.length };
  files.forEach((f, i) => {
    fileList[i] = f;
  });
  return fileList;
}

const validResume = makeFileList([{ name: 'resume.pdf', type: 'application/pdf', size: 1000 }]);

function baseData(overrides = {}) {
  return {
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543210',
    dob: '2000-01-15',
    employmentStatus: 'unemployed' as const,
    certifications: [],
    resume: validResume,
    photo: undefined,
    ...overrides,
  };
}

describe('formSchema', () => {
  it('passes with valid minimal data', () => {
    const result = formSchema.safeParse(baseData());
    expect(result.success).toBe(true);
  });

  it('fails when full name is too short', () => {
    const result = formSchema.safeParse(baseData({ fullName: 'A' }));
    expect(result.success).toBe(false);
  });

  it('fails on an invalid email', () => {
    const result = formSchema.safeParse(baseData({ email: 'not-an-email' }));
    expect(result.success).toBe(false);
  });

  it('fails when the applicant is under 16', () => {
    const recentYear = new Date().getFullYear() - 5;
    const result = formSchema.safeParse(baseData({ dob: `${recentYear}-01-01` }));
    expect(result.success).toBe(false);
  });

  it('fails when employed but companyName/jobTitle are missing', () => {
    const result = formSchema.safeParse(baseData({ employmentStatus: 'employed' }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('companyName');
      expect(paths).toContain('jobTitle');
    }
  });

  it('passes when employed and companyName/jobTitle are provided', () => {
    const result = formSchema.safeParse(
      baseData({ employmentStatus: 'employed', companyName: 'Acme', jobTitle: 'Developer' })
    );
    expect(result.success).toBe(true);
  });

  it('fails when student but schoolName/graduationYear are missing', () => {
    const result = formSchema.safeParse(baseData({ employmentStatus: 'student' }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('schoolName');
      expect(paths).toContain('graduationYear');
    }
  });

  it('does not require company or school fields when unemployed', () => {
    const result = formSchema.safeParse(baseData({ employmentStatus: 'unemployed' }));
    expect(result.success).toBe(true);
  });

  it('fails when a certification entry is missing a name', () => {
    const result = formSchema.safeParse(
      baseData({ certifications: [{ name: '', year: 2022 }] })
    );
    expect(result.success).toBe(false);
  });

  it('passes with a valid certification entry', () => {
    const result = formSchema.safeParse(
      baseData({ certifications: [{ name: 'AWS Basics', year: 2022 }] })
    );
    expect(result.success).toBe(true);
  });

  it('fails when resume is missing', () => {
    const result = formSchema.safeParse(baseData({ resume: makeFileList([]) }));
    expect(result.success).toBe(false);
  });

  it('fails when resume file type is not pdf/word', () => {
    const badResume = makeFileList([{ name: 'resume.png', type: 'image/png', size: 1000 }]);
    const result = formSchema.safeParse(baseData({ resume: badResume }));
    expect(result.success).toBe(false);
  });

  it('fails when resume is over the size limit', () => {
    const bigResume = makeFileList([
      { name: 'resume.pdf', type: 'application/pdf', size: 6 * 1024 * 1024 },
    ]);
    const result = formSchema.safeParse(baseData({ resume: bigResume }));
    expect(result.success).toBe(false);
  });

  it('allows photo to be left empty since it is optional', () => {
    const result = formSchema.safeParse(baseData({ photo: makeFileList([]) }));
    expect(result.success).toBe(true);
  });
});
