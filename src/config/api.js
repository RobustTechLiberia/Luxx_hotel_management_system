// Detect environment and use local server for development, remote for production
const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";

export const API_BASE_URL = isLocal
  ? "http://localhost:3000"
  : "https://luxx-hotel-api.gabrielwkun.workers.dev";
