

const BASE_URL = "https://newsapi.org/v2/top-headlines";

const container = document.getElementById("newsContainer");

const searchInput = document.getElementById("searchInput");

// fetch news by category(default sports)

async function fetchNews(category = "sports") {
    try{
        const res = await fetch(`${BASE_URL}?country=us&category=${category}&apiKey=${API_KEY}`);
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
    const res = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    displayArticles(data.articles);
  } catch (error) {
    console.error("Search failed:", error);
  }
}

// Display articles dynamically
function displayArticles(articles) {
  container.innerHTML = "";
  if (!articles || articles.length === 0) {
    container.innerHTML = "<p>No news found.</p>";
    return;
  }
  articles.forEach(article => {
    const card = document.createElement("div");
    card.classList.add("news-card");
    card.innerHTML = `
      <img src="${article.urlToImage || 'assets/placeholder.png'}" alt="News image">
      <h2>${article.title}</h2>
      <p>${article.description || ""}</p>
      <a href="${article.url}" target="_blank">Read More</a>
    `;
    container.appendChild(card);
  });
}

// Handle category button clicks
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("nav button.active").classList.remove("active");
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
fetchNews();