import express from "express";
import "dotenv/config";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const BASE_URL = "https://newsapi.org/v2/top-headlines";
const API_KEY = process.env.MY_API_KEY;

const app = express();
app.use(cors());

// --- Serve frontend files (optional but recommended) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname)); // <-- put your index.html, JS, CSS in /public

// --- API ROUTES ---

app.get("/api/news", async (req, res) => {
  const category = req.query.category || "sports";
    const url = `${BASE_URL}?country=us&category=${category}&apiKey=${API_KEY}`;
  console.log("🔗 Fetching URL:", url);
  console.log("🔑 API Key present?", !!API_KEY);
  const response = await fetch(url);
console.log("Status:", response.status);
console.log("Headers:", response.headers.raw());
const text = await response.text();
console.log("Response starts with:", text.slice(0, 200));


  try {
    const response = await fetch(
      `${BASE_URL}?country=us&category=${category}&apiKey=${API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Backend news fetch error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res
      .status(400)
      .json({ error: "Query parameter 'q' is required" });
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&apiKey=${API_KEY}`
    );
    const data = await response.json();

    if (data.status !== "ok") {
      return res
        .status(500)
        .json({ error: "Failed to fetch news from API" });
    }

    res.json(data);
  } catch (err) {
    console.error("Backend search error:", err);
    res.status(500).json({ error: "Server error while searching news" });
  }
});

// --- Fallback: Serve index.html for any other route (for SPAs) ---
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --- Use Render-assigned port ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);

console.log("🔑 API Key exists:", !!API_KEY);
