import express from "express";
import 'dotenv/config';
import fetch from "node-fetch";
import cors from "cors";


const BASE_URL = "https://newsapi.org/v2/top-headlines";
const API_KEY = process.env.MY_API_KEY;
const app = express();
app.use(cors());

app.get("/api/news", async (req, res) => {
  const category = req.query.category || "sports";
  const response = await fetch(`${BASE_URL}?country=us&category=${category}&apiKey=${API_KEY}`);
  const data = await response.json();
  res.json(data); // send result to frontend
});

app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`
    );
    const data = await response.json();

    if (data.status !== "ok") {
      return res.status(500).json({ error: "Failed to fetch news from API" });
    }

    res.json(data);
  } catch (err) {
    console.error("Backend search error:", err);
    res.status(500).json({ error: "Server error while searching news" });
  }
});

app.listen(3000, () => console.log("Server running on 3000"));