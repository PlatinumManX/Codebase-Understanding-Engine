const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

export async function getRepositories(signal) {
  try {
    const response = await fetch(`${API_BASE}/api/repositories`, { signal });
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    return await response.json();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[repositoryApi] getRepositories failed:', error);
    }
    throw error;
  }
}

export async function deleteRepository(repositoryId, signal) {
  try {
    const response = await fetch(`${API_BASE}/api/repositories/${repositoryId}`, {
      method: 'DELETE',
      signal,
    });
    if (!response.ok) {
      throw new Error('Failed to delete repository');
    }
    return await response.json();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[repositoryApi] deleteRepository failed:', error);
    }
    throw error;
  }
}

export async function patchRepository(repositoryId, updateData, signal) {
  try {
    const response = await fetch(`${API_BASE}/api/repositories/${repositoryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
      signal,
    });
    if (!response.ok) {
      throw new Error('Failed to update repository');
    }
    return await response.json();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[repositoryApi] patchRepository failed:', error);
    }
    throw error;
  }
}

export async function getActiveRepository(signal) {
  try {
    const response = await fetch(`${API_BASE}/api/repositories/active`, { signal });
    if (!response.ok) {
      throw new Error('No active repository configured');
    }
    return await response.json();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[repositoryApi] getActiveRepository failed:', error);
    }
    throw error;
  }
}

export async function getRepositoryGraph(repositoryId, signal) {
  try {
    const response = await fetch(`${API_BASE}/api/repositories/${repositoryId}/graph`, { signal });
    if (!response.ok) {
      throw new Error('Failed to fetch repository graph');
    }
    return await response.json();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[repositoryApi] getRepositoryGraph failed:', error);
    }
    throw error;
  }
}
