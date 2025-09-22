const container = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://news-aggregator-hp1q.onrender.com";

// --- Topics supported by GNews ---
const topics = ["world", "nation", "business", "technology", "entertainment", "sports", "science", "health"];

// Dynamically create category buttons
const nav = document.querySelector("nav");
topics.forEach((topic, i) => {
  const btn = document.createElement("button");
  btn.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
  btn.dataset.category = topic;
  if (i === 0) btn.classList.add("active"); // default active
  nav.appendChild(btn);
});

// Fetch news by category (default: first topic)
async function fetchNews(category = "world") {
  try {
    const res = await fetch(`${API_BASE}/api/news?category=${category}`);
    const data = await res.json();
    displayArticles(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    container.innerHTML = "<p>Failed to load news. Try again later.</p>";
  }
}

// Search function
async function searchNews(query) {
  try {
    const res = await fetch(
      `${API_BASE}/api/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    displayArticles(data.articles);
  } catch (error) {
    console.error("Search failed:", error);
    container.innerHTML = "<p>Search failed. Try again later.</p>";
  }
}

// Display articles dynamically
function displayArticles(articles) {
  container.innerHTML = "";
  if (!articles || articles.length === 0) {
    container.innerHTML = "<p>No news found.</p>";
    return;
  }

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("news-card");

    card.innerHTML = `
      <img src="${article.image || "assets/placeholder.png"}" alt="News image">
      <h2>${article.title}</h2>
      <p>${article.description || ""}</p>
      <small>Source: ${article.source?.name || "Unknown"} | ${new Date(article.publishedAt).toLocaleString()}</small>
      <a href="${article.url}" target="_blank">Read More</a>
    `;
    container.appendChild(card);
  });
}

// Handle category button clicks
document.querySelectorAll("nav button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const activeBtn = document.querySelector("nav button.active");
    if (activeBtn) activeBtn.classList.remove("active");
    btn.classList.add("active");
    fetchNews(btn.dataset.category);
  });
});

// Handle search
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchNews(e.target.value);
  }
});

// Load default category on start
fetchNews("world");
