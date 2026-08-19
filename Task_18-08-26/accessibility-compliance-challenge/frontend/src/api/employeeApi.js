const BASE_URL = '/api/employees';

async function handleResponse(res) {
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.message || 'Request failed');
  }
  return body;
}

export async function fetchEmployees(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null)
  ).toString();
  const res = await fetch(`${BASE_URL}${query ? `?${query}` : ''}`);
  return handleResponse(res);
}

export async function fetchDepartments() {
  const res = await fetch(`${BASE_URL}/departments`);
  return handleResponse(res);
}
