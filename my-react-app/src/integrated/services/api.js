const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(method, path, data, options = {}) {
  const url = new URL(`${API_URL}${path}`, window.location.origin);
  Object.entries(options.params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  });
  const isFormData = data instanceof FormData;
  const response = await fetch(url, {
    method,
    credentials: "include",
    headers: isFormData ? options.headers : { "Content-Type": "application/json", ...options.headers },
    body: data === undefined ? undefined : isFormData ? data : JSON.stringify(data),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status})`);
  return { data: payload };
}

const api = {
  get: (path, options) => request("GET", path, undefined, options),
  post: (path, data, options) => request("POST", path, data, options),
  put: (path, data, options) => request("PUT", path, data, options),
  delete: (path, options) => request("DELETE", path, undefined, options),
};

export default api;
