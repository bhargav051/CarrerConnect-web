let BASE_URL = "";

if (import.meta.env.MODE === "development") {
  // When running locally → Vite dev mode
  BASE_URL = "http://localhost:3000";
} else {
  // When deployed → Vercel production build
  BASE_URL = "https://carrerconnect-kvrj.onrender.com";
}

export { BASE_URL };
