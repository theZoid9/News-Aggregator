document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("newsContainer");
  const searchInput = document.getElementById("searchInput");

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://news-aggregator-hp1q.onrender.com";

  // --- Topics supported by GNews ---
  const topics = [
    "world",
    "nation",
    "business",
    "technology",
    "entertainment",
    "sports",
    "science",
    "health"
  ];

  // Ensure HTML buttons match GNews topics
  const navButtons = document.querySelectorAll("nav button");

  // Attach category button event listeners
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeBtn = document.querySelector("nav button.active");
      if (activeBtn) activeBtn.classList.remove("active");
      btn.classList.add("active");
      fetchNews(btn.dataset.category);
    });
  });

  // Fetch news by category (default: first active button)
  async function fetchNews(category) {
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
      <img src="${article.image || 'assets/placeholder.png'}" alt="News image">
      <div class="news-content">
        <h2>${article.title}</h2>
        <p>${article.description || ''}</p>
        <small>Source: ${article.source?.name || 'Unknown'} | ${new Date(article.publishedAt).toLocaleDateString()}</small>
        <a href="${article.url}" target="_blank">Read More</a>
      </div>
    `;

      container.appendChild(card);
    });
  }

  // Handle search input
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      searchNews(e.target.value);
    }
  });

  // Load default category on start (first active button)
  const defaultBtn = document.querySelector("nav button.active");
  const defaultCategory = defaultBtn?.dataset.category || "world";
  fetchNews(defaultCategory);
});
