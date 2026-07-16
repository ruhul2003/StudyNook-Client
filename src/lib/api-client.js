const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  let finalUrl = url;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, val);
      }
    });
    const queryStr = searchParams.toString();
    if (queryStr) {
      finalUrl += `?${queryStr}`;
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(finalUrl, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.response = {
      status: response.status,
      data: data,
    };
    throw error;
  }

  return { data };
}

export const api = {
  get: (endpoint, config = {}) => request(endpoint, { method: 'GET', ...config }),
  post: (endpoint, body, config = {}) => request(endpoint, { method: 'POST', body, ...config }),
  put: (endpoint, body, config = {}) => request(endpoint, { method: 'PUT', body, ...config }),
  patch: (endpoint, body, config = {}) => request(endpoint, { method: 'PATCH', body, ...config }),
  delete: (endpoint, config = {}) => request(endpoint, { method: 'DELETE', ...config }),
};

export default api;
