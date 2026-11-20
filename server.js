require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Pubmed base address
const PUBMED_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const EAST_AFRICA = '(Rwanda OR Tanzania OR Kenya OR Uganda OR Burundi OR "South Sudan" OR "Democratic Republic of the Congo" OR Somalia)';

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

app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () =>{
  console.log(`CCRF server running at http://localhost:${PORT}`);
});
