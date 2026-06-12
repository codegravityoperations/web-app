const normalizeApiBaseUrl = (value) => {
  const raw = (value || "").trim()
  if (!raw) return "/api"
  if (raw.startsWith("/")) return raw.replace(/\/$/, "")

  const cleaned = raw
    .replace(/^(https?:)?\/\//, "")
    .replace(/^(https?:)?\/\//, "")
    .replace(/^\/+/, "")

  const scheme = raw.toLowerCase().startsWith("https") ? "https://" : raw.toLowerCase().startsWith("http") ? "http://" : "https://"
  return `${scheme}${cleaned}`.replace(/\/$/, "")
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)
const API_BASE = API_BASE_URL.replace(/\/$/, "")
const buildApiUrl = (path) => `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`

export const API = {
  login:             buildApiUrl("/auth/login"),
  logout:            buildApiUrl("/auth/logout"),
  refresh:           buildApiUrl("/auth/refresh"),
  registerEmployee:  buildApiUrl("/employees/register"),
  registerCandidate: buildApiUrl("/candidates/register"),
  candidates:        buildApiUrl("/candidates"),
}

const storageKey = {
  access: "accessToken",
  refresh: "refreshToken",
}

export const saveTokens = (access, refresh) => {
  localStorage.setItem(storageKey.access, access)
  localStorage.setItem(storageKey.refresh, refresh)
}

export const clearTokens = () => {
  localStorage.removeItem(storageKey.access)
  localStorage.removeItem(storageKey.refresh)
}

export const getAccessToken = () => localStorage.getItem(storageKey.access)

export async function apiFetch(url, { method = "POST", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" }
  if (auth) {
    const token = getAccessToken()
    if (!token) throw new Error("Authentication required")
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const text = await res.text()
  const json = text ? JSON.parse(text) : {}

  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed (${res.status})`)
  }

  return json
}

export const getUserRoleFromToken = () => {
  const token = getAccessToken();

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return (
      payload.role ||
      payload.roles ||
      payload.authority ||
      payload.authorities ||
      null
    );
  } catch {
    return null;
  }
};
