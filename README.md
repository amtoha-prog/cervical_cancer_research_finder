# CCRF - Cervical Cancer Research Finder

**Live website.** https://www.alissamtoha.tech
**Demo video** 

## What is CCRF?

CCRF is a simple websit that helps people **find publisehed research about cervical cancer East Africa**.

## About

Cervical cancer is a major public health concern, mainly in regions where access to prevention, screening and early treatment remains limited. According to the [World Health Organization (WHO)](https://www.who.int/news-room/fact-sheets/detail/cervical-cancer), cervical cancer is largelt preventable through HPV vaccination, screening and timely treatment.

The Cervical Cancer Research Finder (CCRF) is a web application that helps users discover published research on cervical cancer relevant to East Africa.

It is designed for health students, researchers, healthcare workers and public health professionals who want to find research more easily.

## How to use

1. Enter a keyword or select one of the quick-search topics:
   - HPV vaccination
   - Screening
   - Prevention
   - Early detection
   - Treatment
2. Select a country to narrow your search, or leave it on **All EAC countries**.
3. Select a publication year range if needed.
4. Choose how to sort the results:
   -**Newest first**
   -**Best match**
5. Click Search to view the matching research articles

Each result displays the article title, authors, journal, publication date and a link to te original PubMed record.

The application also displays messages when no articles are found or when the API cannot be reached.

## Countries Covered
 
CCRF focuses on the eight East African Community (EAC) partner states:
 
- Rwanda
- Tanzania
- Kenya
- Uganda
- Burundi
- South Sudan
- Democratic Republic of the Congo
- Somalia

**Importance limitation:** Country matching is based on information found in text or author affiliations. This does not necessarily mean that their research was conducted in the selected country. Their application displays up to 20 results per search.

## API Used

CCRF uses the **PubMed API through NCBI E-utilities** to retrieve published research.

The application uses to main endpoints:

| Endpoint | Purpose |
| --- | --- |
|Esearch | Searches PubMed using the user's keywords and filters, then returns matching article IDs. |
| ESummary | Uses those IDs to retrieve article information such as titles, authors, journals and publication dates. |

Official documentation: [NCBI E-utilities]
(https://www.ncbi.nlm.nih.gov/books/NBK25501) · Beginner guide: [E-utilities Quick Start](https://eutilities.github.io/site/Quick_Start/eu_quick/)

The API requests are handled by the Node.js backend rather than directly from the browser. NCBI request details are configured using environment variables, and the optional API key is kept on the server.

## Application Architecture

The application is deployed across two web servers behind a load balancer.

```text
                 Browser
                    |
                    v
       lb-01 – HAProxy Load Balancer
          www.alissamtoha.tech
               /        \
              v          v
          web-01       web-02
          Nginx        Nginx
            |            |
            v            v
       CCRF App      CCRF App
       Node.js       Node.js
       + Express     + Express
            \            /
             \          /
              v        v
          PubMed E-utilities API
```

The load balancer distributes incoming requests between the web servers.

## Technologies Used

- **HTML** – application structure
- **CSS** – styling and responsive layout
- **JavaScript** – frontend interactions
- **Node.js** – backend runtime
- **Express.js** – backend routing
- **dotenv** – loads private settings from the `.env` file
- **PubMed / NCBI E-utilities** – research data
- **Nginx** – web server and reverse proxy
- **HAProxy** – load balancing
- **PM2** – Node.js process management

## Project Structure

```text
cervical_cancer_research_finder/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── deploy/
│   ├── nginx-web.conf
│   └── haproxy.cfg
│
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```
