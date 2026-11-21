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
