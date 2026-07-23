/* SHARED API CLIENT
   Both client-website and admin-dashboard consume the same backend
   through this shared module. Each application can extend with
   app-specific endpoints as needed.
*/

const API = {
  base: '/api',

  async get(endpoint) {
    const res = await fetch(this.base + endpoint);
    if (!res.ok) throw new Error(`GET ${endpoint} failed`);
    return res.json();
  },

  async post(endpoint, data) {
    const res = await fetch(this.base + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`POST ${endpoint} failed`);
    return res.json();
  },

  async put(endpoint, data) {
    const res = await fetch(this.base + endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`PUT ${endpoint} failed`);
    return res.json();
  },

  async del(endpoint) {
    const res = await fetch(this.base + endpoint, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE ${endpoint} failed`);
    return res.json();
  },
};

/* Domain-specific API namespaces */
API.products = {
  list: () => API.get('/products'),
  get: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.del(`/products/${id}`),
};

API.features = {
  list: () => API.get('/features'),
  update: (id, data) => API.put(`/features/${id}`, data),
};

API.projects = {
  list: () => API.get('/projects'),
  get: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.del(`/projects/${id}`),
};

API.media = {
  list: () => API.get('/media'),
  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    return fetch(API.base + '/media/upload', { method: 'POST', body: form }).then(r => r.json());
  },
  delete: (id) => API.del(`/media/${id}`),
};

API.settings = {
  get: () => API.get('/settings'),
  update: (data) => API.put('/settings', data),
};

API.auth = {
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.post('/auth/logout'),
  me: () => API.get('/auth/me'),
};

API.hotspots = {
  list: () => API.get('/hotspots'),
  update: (id, data) => API.put(`/hotspots/${id}`, data),
};
