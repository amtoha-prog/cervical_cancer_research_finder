require("dontev").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/health", (req, res)) => {
  res.fson({ status: "ok" });
});

app.listen(PORT, () =>{
  console.log(`CCRF server running at http://localhost:${PORT}`);
});
