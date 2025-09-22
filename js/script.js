const container = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://news-aggregator-hp1q.onrender.com";

// Topics
const topics = ["world", "nation", "business", "technology", "entertainment", "sports", "science", "health"];

// Dynamically create category buttons
const nav = document.querySelector("nav");
topics.forEach((topic, i) => {
  const btn = document.createElement("button");
  btn.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
  btn.dataset.category = topic;
  if (i === 0) btn.classList.add("active");
  nav.appendChild(btn);
});

// Fetch news
async function fetchNews(category = "world") {
  try {
    const res = await fetch(`${API_BASE}/api/news?category=${category}`);
    const data = await res.json();
    displayArticles(data.articles || []);
  } catch (error) {
    console.error("Error fetching news:", error);
    container.innerHTML = "<p>Failed to load news. Try again later.</p>";
  }
}

// Search
async function searchNews(query) {
  try {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    displayArticles(data.articles || []);
  } catch (error) {
    console.error("Search failed:", error);
    container.innerHTML = "<p>Search failed. Try again later.</p>";
  }
}

// Display articles
function displayArticles(articles) {
  container.innerHTML = "";
  if (!articles.length) {
    container.innerHTML = "<p>No news found.</p>";
    return;
  }

  // Top article
  const top = articles[0];
  const topCard = document.createElement("div");
  topCard.classList.add("news-card", "top-article");
  topCard.innerHTML = `
    <img src="${top.image || 'assets/placeholder.png'}" alt="Top news">
    <div class="news-content">
      <h2>${top.title}</h2>
      <p>${top.description || ""}</p>
      <small>Source: ${top.source?.name || "Unknown"} | ${new Date(top.publishedAt).toLocaleDateString()}</small>
      <a href="${top.url}" target="_blank">Read More</a>
    </div>
  `;
  container.appendChild(topCard);

  // Grid of other articles
  if (articles.length > 1) {
    const grid = document.createElement("div");
    grid.classList.add("articles-grid");

    articles.slice(1).forEach(article => {
      const card = document.createElement("div");
      card.classList.add("news-card");
      card.innerHTML = `
        <img src="${article.image || 'assets/placeholder.png'}" alt="News image">
        <div class="news-content">
          <h3>${article.title}</h3>
          <p>${article.description || ""}</p>
          <small>Source: ${article.source?.name || "Unknown"} | ${new Date(article.publishedAt).toLocaleDateString()}</small>
          <a href="${article.url}" target="_blank">Read More</a>
        </div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }
}

// Handle category clicks
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("nav button.active")?.classList.remove("active");
    btn.classList.add("active");
    fetchNews(btn.dataset.category);
  });
});

// Search input
searchInput.addEventListener("keyup", e => {
  if (e.key === "Enter") searchNews(e.target.value);
});

// Load default category
fetchNews("world");
