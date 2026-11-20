require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Pubmed base address
const PUBMED_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const EAST_AFRICA = '(Rwanda OR Tanzania OR Kenya OR Uganda OR Burundi OR "South Sudan" OR "Democratic Republic of the Congo" OR Somalia)';
const COUNTRIES = ["Rwanda", "Tanzania", "Kenya", "Uganda", "Burundi", "South Sudan", "Democratic Republic of the Congo", "Somalia"];

// The Pubmed search words are from the user's choices
function buildSearchTerm(keywords, country) {
  let term = "cervical cancer";

  // Adding the user's keywords if they typed any
  if (keywords) {
    term = term + " AND (" + keywords + ")";
  }

  // Add one country, or all East African countries
  if (country) {
    term = term + " AND " + country;
  } else {
    term = term + " AND " + EAST_AFRICA;
  }

  return term;
}

// Added the settings NCBI asks for in evry request
function addNcbiSettings(params) {
  params.append("tool", process.env.NCBI_TOOL);
  params.append("email", process.env.NCBI_EMAIL);

  if (process.env.NCBI_API_KEY) {
    params.append("api_key", process.env.NCBI_API_KEY);
  }
}
// Asking PubMed (Esearch) for the IDs of matching articles
async function searchPubMed(term, sort, fromYear, toYear) {
  const params = new URLSearchParams({
    db: "pubmed",
    term: term, 
    retmode: "json",
    retmax: "20",
    sort: sort,
  });
  
  if (fromYear && toYear) {
    params.append("datetype", "pdat");
    params.append("mindate", fromYear);
    params.append("maxdate", toYear);
  }

  addNcbiSettings(params);
  // Sending a request and wait for PubMed's answer
  const response = await fetch(PUBMED_URL + "/esearch.fcgi?" + params.toString());

  if (!response.ok) {
    throw new Error("PubMed search failed with status" + response.status);
  }

  // Turn the JSON text into a Javascript object
  const data = await response.json();
  return data.esearchresult;
}


// Shows up to 3 author names, if more it's "et al."
function formatAuthors(authors) {
  const names = authors.map((author) => author.name)

  if (names.length === 0) {
    return "Authors not listed";
  }
  if (names.length > 3) {
    return names.slice(0, 3).join(", ") + " et al.";
  }
  return names.join(", ");
}

async function getArticleDetails(ids) {
  const params = new URLSearchParams({
    db: "pubmed",
    id: ids.join(","),
    retmode: "json",
  });
  
  addNcbiSettings(params);

  const response = await fetch (PUBMED_URL + "/esummary.fcgi?" + params.toString());
  
  if (!response.ok) {
    throw new Error("PubMed details failed with status" + response.status);
  }

  const data = await response.json();

  const articles = [];
  for (const id of data.result.uids) {
    const article = data.result[id];
    articles.push({
      id: id,
      title: article.title,
      authors: formatAuthors(article.authors),
      journal: article.source,
      date: article.pubdate,
      link: "https://pubmed.ncbi.nlm.nih.gov/" + id + "/",
    });
  }

  return articles;
}
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/search", async (req, res) => {
  // Reading the user's choices from the URL
  const keywords = (req.query.keywords || "").trim();
  const country = req.query.country || "";
  const fromYear = req.query.fromYear || "";
  const toYear = req.query.toYear || "";
})
app.listen(PORT, () =>{
  console.log(`CCRF server running at http://localhost:${PORT}`);
});
getArticleDetails(["43041668", "43024150"]).then((articles) => console.log(articles));
