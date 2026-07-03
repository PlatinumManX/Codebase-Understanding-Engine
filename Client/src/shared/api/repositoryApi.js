const API_BASE = 'http://localhost:8000';

export async function uploadRepository(repositoryName, repositoryFile, signal) {
  const formData = new FormData();
  formData.append('repository_name', repositoryName);
  formData.append('repository_file', repositoryFile);

  if (import.meta.env.DEV) {
    console.debug('[repositoryApi] Request started for:', repositoryName);
  }

  try {
    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      let errorDetail = 'Upload failed';
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errorDetail;
      } catch (e) {
        // fallback
      }
      throw new Error(errorDetail);
    }

    const data = await response.json();
    if (import.meta.env.DEV) {
      console.debug('[repositoryApi] Request completed successfully. Response:', data);
    }
    return data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[repositoryApi] Request failed with error:', error);
    }
    throw error;
  }
}
