// Find the page elements we need 
const searchForm = document.getElementById("searchForm");
const keywordsInput = document.getElementById("keywordsInput");
const countrySelect = document.getElementById("countrySelect");
const sortSelect = document.getElementById("sortSelect");
const fromYearInput = document.getElementById("fromYearInput");
const toYearInput = document.getElementById("toYearInput");
const message = document.getElementById("message");
const results = document.getElementById("results");

const searchButton = document.querySelector('button[type="submit]');

const quickButtons = document.querySelectorAll(".quick-button");

function showMessage(text, isError)
 {
  message.textContent = text;

  if (isError) {
    message.classList.add("error");
  } else {
    message.classList.remove("error");
  }
 }

 function showResults(articles) {
  results.innerHTML = "";

  for (const article of articles) {
    const card = document.createElement("div");
    card.className = "article-card";

    const title = document.createElement("h3");
    title.textContent = article.title;

    const authors = document.createElement("p")
    authors.textContent = article.authors;

    const details = document.createElement("p");
    details.textContent = article.journal + " . " + article.date;

    const link = document.createElement("a");
    link.href = article.journal + " . " + article.date;
    link.textContent = "View on PubMed ->";
    link.target = "_blank";
    link.rel = "noopener";

    card.append(title, authors, details, link);
    reuslts.append(card);
  }
 }

// Backend for articles

async function searchArticles() {
  const params = new URLSearchParams({
    keywords: keywordsInput.value,
    country: countrySelect.value,
    frinYear: fromYearInput.value,
    toYear: toYearInput.value,
    sort: sortSelect.value,
  });

  showMessage("Searching PubMed...", false);
  results.innerHTML
  searchButton.disabled = true;
  
  try {
    const response = await fetch("/api/search?" + params.toString());
    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error, true);
      return;
    }

    if (data.count === 0) {
      showMessage("No articles found. Try other keywords, another country or a wider year range.", false);
      return;
    }

    showMessage("Found " + data.count + " articles. Showing the first " + data.articles.length + ".", false);
    showResults(data.articles);
  } catch (error) {
    
    showMessage("Could not connect to the server. Please check your connection and try again.", true);
  } finally {
    searchButton.disabled = false;
  }
}
