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
