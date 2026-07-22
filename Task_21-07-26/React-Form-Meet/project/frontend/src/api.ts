const API_URL = 'http://localhost:4000';

export async function submitApplication(formData: FormData) {
  const res = await fetch(`${API_URL}/api/applications`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || 'Something went wrong, please try again');
  }

  return res.json();
}
