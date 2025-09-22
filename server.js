import express from "express";
import "dotenv/config";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const BASE_URL = "https://gnews.io/api/v4";
const API_KEY = process.env.MY_GNEWS_KEY; // <-- Use your GNews API key here

const app = express();
app.use(cors());

// --- Serve frontend files ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname)); // index.html, JS, CSS in root

// --- API ROUTES ---

// Fetch news by category
app.get("/api/news", async (req, res) => {
  const category = req.query.category || "sports";
  const url = `${BASE_URL}/top-headlines?topic=${category}&lang=en&country=us&token=${API_KEY}`;
  
  console.log("🔗 Fetching URL:", url);
  console.log("🔑 API Key present?", !!API_KEY);

  try {
    const response = await fetch(url);

    console.log("Status:", response.status);
    console.log("Headers:", response.headers.raw());
    const text = await response.text();
    console.log("Response starts with:", text.slice(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error("❌ Failed to parse JSON:", jsonErr.message);
      return res.status(500).json({ error: "Invalid response from GNews" });
    }

    res.json(data);
  } catch (err) {
    console.error("Backend news fetch error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// Search news
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

  const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=en&country=us&token=${API_KEY}`;
  
  console.log("🔗 Searching URL:", url);

  try {
    const response = await fetch(url);
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error("❌ Failed to parse JSON:", jsonErr.message);
      return res.status(500).json({ error: "Invalid response from GNews" });
    }

    res.json(data);
  } catch (err) {
    console.error("Backend search error:", err);
    res.status(500).json({ error: "Server error while searching news" });
  }
});

// --- Fallback: Serve index.html ---
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --- Render port ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

console.log("🔑 API Key exists:", !!API_KEY);
