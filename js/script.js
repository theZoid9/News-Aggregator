const container = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://news-aggregator-hp1q.onrender.com";

// Topics
const topics = ["technology", "entertainment", "sports", "science", "health"];

// Select nav
const nav = document.querySelector("nav");

// Create a container div inside nav for buttons
const btnContainer = document.createElement("div");
btnContainer.classList.add("flex", "space-x-4", "mt-2");
nav.appendChild(btnContainer);

topics.forEach((topic, i) => {
  const btn = document.createElement("button");
  btn.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
  btn.dataset.category = topic;
  
  // Tailwind styling
  btn.classList.add(
    "px-4",
    "py-2",
    "rounded",
    "text-gray-700",
    "hover:bg-gray-200",
    "transition",
    "duration-200"
  );

  if (i === 0) btn.classList.add("bg-gray-200", "font-semibold"); // active

  // Handle active toggle on click
  btn.addEventListener("click", () => {
    btnContainer.querySelectorAll("button").forEach(b => b.classList.remove("bg-gray-200", "font-semibold"));
    btn.classList.add("bg-gray-200", "font-semibold");
    // You can also trigger filtering logic here based on btn.dataset.category
  });

  btnContainer.appendChild(btn);
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


function displayArticles(articles) {
  
  const container = document.getElementById("articles-container");
  container.innerHTML = "";
  if (!articles.length) {
    container.innerHTML = "<p class='text-center text-gray-500'>No news found.</p>";
    return;
  }

  // Top article (first article spans full width)
  const top = articles[0];
  const topCard = document.createElement("div");
  topCard.classList.add(
    "mb-8",
    "bg-white",
    "shadow-md",
    "rounded-lg",
    "overflow-hidden",
    "md:col-span-3", // spans all 3 columns
    "flex",
    "flex-col",
    "md:flex-row"
  );
  topCard.innerHTML = `
    <img class="w-full md:w-1/2 h-64 object-cover" src="${top.image || ''}" alt="Top news">
    <div class="p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-3xl font-bold mb-2">${top.title}</h2>
        <p class="text-gray-700 mb-4">${top.description || ""}</p>
      </div>
      <div class="text-gray-500 text-sm">
        Source: ${top.source?.name || ""} | ${top.publishedAt ? new Date(top.publishedAt).toLocaleDateString() : ""}
      </div>
      <a class="mt-4 text-blue-600 hover:underline" href="${top.url}" target="_blank">Read More →</a>
    </div>
  `;
  container.appendChild(topCard);

  // Grid for other articles
  if (articles.length > 1) {
    articles.slice(1).forEach(article => {
      const card = document.createElement("div");
      card.classList.add("bg-white", "shadow-sm", "rounded-lg", "overflow-hidden", "flex", "flex-col");
      card.innerHTML = `
        <img class="h-48 w-full object-cover" src="${article.image || ''}" alt="News image">
        <div class="p-4 flex flex-col flex-1">
          <h3 class="text-xl font-semibold mb-2">${article.title}</h3>
          <p class="text-gray-700 mb-2 flex-1">${article.description || ""}</p>
          <small class="text-gray-500 text-sm">
            Source: ${article.source?.name || ""} | ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}
          </small>
          <a class="mt-2 text-blue-600 hover:underline" href="${article.url}" target="_blank">Read More →</a>
        </div>
      `;
      container.appendChild(card);
    });
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
