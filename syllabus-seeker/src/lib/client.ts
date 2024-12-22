// lib/client.ts
export async function fetchSyllabi(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/syllabi?${params}`);
  if (!response.ok) throw new Error('Failed to fetch syllabi');
  return response.json();
}

export async function uploadSyllabus(formData) {
  const response = await fetch('/api/syllabi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error('Failed to upload syllabus');
  return response.json();
}

export async function uploadFile(file) {
  const response = await fetch(`/api/upload?filename=${file.name}`, {
    method: 'POST',
    body: file,
  });
  if (!response.ok) throw new Error('Failed to upload file');
  return response.json();
}