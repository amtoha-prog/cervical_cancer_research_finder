require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

const PUBMED_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const EAST_AFRICA = '(Rwanda OR Tanzania OR Kenya OR Uganda OR Burundi OR "South Sudan" OR "Democratic Republic of the Congo" OR Somalia)';

function buildSearchTerm(keywords, country) {
  let term = "cervical cancer";

  if (keywords) {
    term = term + " AND (" + keywords + ")";
  }

  if (country) {
    term = term + " AND " + country;
  } else {
    term = term + " AND " + EAST_AFRICA;
  }

  return term;
}

app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () =>{
  console.log(`CCRF server running at http://localhost:${PORT}`);
});

console.log(buildSearchTerm("HPV vaccine", "Kenya"));
