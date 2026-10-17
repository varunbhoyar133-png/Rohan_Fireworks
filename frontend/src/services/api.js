const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof process !== 'undefined' && process.env?.BACKEND_URL) {
    return `${process.env.BACKEND_URL}/api`;
  }
  return '/api';
};

const API_BASE = getBaseUrl();

export const getAuthToken = () => localStorage.getItem('rohan_admin_token');
export const setAuthToken = (token) => localStorage.setItem('rohan_admin_token', token);
export const removeAuthToken = () => localStorage.removeItem('rohan_admin_token');

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData, set Content-Type JSON
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// API Services
export const authAPI = {
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getProfile: () => apiFetch('/auth/profile'),
  changePassword: (data) => apiFetch('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return apiFetch(`/products?${query.toString()}`);
  },
  getByIdOrSlug: (idOrSlug) => apiFetch(`/products/${idOrSlug}`),
  create: (formDataOrData) => {
    const isFormData = formDataOrData instanceof FormData;
    return apiFetch('/products', {
      method: 'POST',
      body: isFormData ? formDataOrData : JSON.stringify(formDataOrData),
    });
  },
  update: (id, formDataOrData) => {
    const isFormData = formDataOrData instanceof FormData;
    return apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: isFormData ? formDataOrData : JSON.stringify(formDataOrData),
    });
  },
  delete: (id) => apiFetch(`/products/${id}`, {
    method: 'DELETE',
  }),
};

export const categoriesAPI = {
  getAll: (includeInactive = false) => apiFetch(`/categories?includeInactive=${includeInactive}`),
  getByIdOrSlug: (idOrSlug) => apiFetch(`/categories/${idOrSlug}`),
  create: (formDataOrData) => {
    const isFormData = formDataOrData instanceof FormData;
    return apiFetch('/categories', {
      method: 'POST',
      body: isFormData ? formDataOrData : JSON.stringify(formDataOrData),
    });
  },
  update: (id, formDataOrData) => {
    const isFormData = formDataOrData instanceof FormData;
    return apiFetch(`/categories/${id}`, {
      method: 'PUT',
      body: isFormData ? formDataOrData : JSON.stringify(formDataOrData),
    });
  },
  delete: (id) => apiFetch(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

export const inventoryAPI = {
  adjustStock: (data) => apiFetch('/inventory/adjust', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/inventory/logs?${query}`);
  },
  getLowStock: () => apiFetch('/inventory/low-stock'),
  getOverview: () => apiFetch('/inventory/overview'),
};

export const enquiriesAPI = {
  submit: (enquiryData) => apiFetch('/enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiryData),
  }),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/enquiries?${query}`);
  },
  getById: (id) => apiFetch(`/enquiries/${id}`),
  updateStatus: (id, data) => apiFetch(`/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiFetch(`/enquiries/${id}`, {
    method: 'DELETE',
  }),
};

export const settingsAPI = {
  get: () => apiFetch('/settings'),
  update: (settingsData) => apiFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  }),
};
