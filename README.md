# CCRF - Cervical Cancer Research Finder

**Live website:** [https://www.alissamtoha.tech](https://www.alissamtoha.tech)  
**Demo video (under 2 minutes):** Add your demo video link here.

## What is CCRF?

CCRF is a simple website that helps people **find published research about cervical cancer in East Africa**.

## About

Cervical cancer is a major public health concern, particularly in regions where access to prevention, screening and early treatment remains limited. According to the [World Health Organization (WHO)](https://www.who.int/news-room/fact-sheets/detail/cervical-cancer), cervical cancer is largely preventable through HPV vaccination, screening and timely treatment.

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
   - **Newest first**
   - **Best match**
5. Click Search to view the matching research articles.

Each result displays the article title, authors, journal, publication date and a link to the original PubMed record.

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

**Important limitation:** Country matching is based on information found in article text or author affiliations. This does not necessarily mean that the research was conducted in the selected country. The application displays up to 20 results per search.

## API Used

CCRF uses the **PubMed API through NCBI E-utilities** to retrieve published research.

The application uses two main endpoints:

| Endpoint | Purpose |
| --- | --- |
| ESearch | Searches PubMed using the user's keywords and filters, then returns matching article IDs. |
| ESummary | Uses those IDs to retrieve article information such as titles, authors, journals and publication dates. |

Official documentation: [NCBI E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25501/) · Beginner guide: [E-utilities Quick Start](https://eutilities.github.io/site/Quick_Start/eu_quick/)

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

The load balancer distributes incoming requests between the two web servers.

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

## Running the Application Locally

### Requirements

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/amtoha-prog/cervical_cancer_research_finder.git
```

### 2. Open the project folder

```bash
cd cervical_cancer_research_finder
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create your local `.env` file from the example:

```bash
cp .env.example .env
```

Add your configuration:

```env
PORT=3000
NCBI_TOOL=your_tool_name
NCBI_EMAIL=your_email
NCBI_API_KEY=your_optional_api_key
```

The API key is optional. Do not commit your `.env` file or expose private credentials in the repository.

### 5. Start the application

```bash
npm start
```

Open the application in your browser at:

```text
http://localhost:3000
```

## Deployment

CCRF is deployed on two web servers and one load balancer.

| Server | Public IP | Role |
|---|---|---|
| web-01 | `3.9.164.248` | Hosts the first application instance |
| web-02 | `18.133.181.20` | Hosts the second application instance |
| lb-01 | `35.177.109.3` | HAProxy load balancer and domain routing |

The live application is accessible through:

[https://www.alissamtoha.tech](https://www.alissamtoha.tech)

### Web Server Deployment

The application is hosted on both web servers.

The deployment process involves:

1. Connecting to each web server using SSH.
2. Installing Node.js and the required dependencies.
3. Cloning the project repository.
4. Creating the environment configuration file.
5. Installing project dependencies using `npm install`.
6. Starting the application using PM2.
7. Configuring Nginx to forward incoming web requests to the Node.js application.
8. Testing the application on each server.

The commands used on each web server (web-01 and web-02):

```bash
ssh -i <your-key-file> ubuntu@<server-ip>
sudo apt update && sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs
git clone https://github.com/amtoha-prog/cervical_cancer_research_finder.git
cd cervical_cancer_research_finder && npm install && cp .env.example .env
sudo npm install -g pm2
pm2 start server.js --name ccrf
pm2 startup   # then run the command it prints
pm2 save
sudo nginx -t && sudo systemctl reload nginx
curl -I http://localhost   # expect X-Served-By: 7345-web-01 or 7345-web-02
```

The Nginx configuration used for the web servers is available in:

[`deploy/nginx-web.conf`](deploy/nginx-web.conf)

### Load Balancer Deployment

HAProxy runs on lb-01. Its configuration ([`deploy/haproxy.cfg`](deploy/haproxy.cfg)):

- redirects HTTP visitors to HTTPS
- decrypts HTTPS using the certificate for www.alissamtoha.tech (SSL termination)
- sends requests to web-01 and web-02 in turn (`balance roundrobin`)
- health-checks both servers and skips any server that is down

### Testing Load Balancing

The application was tested by sending multiple requests through the domain and checking the `X-Served-By` response header.

```bash
curl -sI https://www.alissamtoha.tech | grep -i x-served-by
```

```text
x-served-by: 7345-web-01
x-served-by: 7345-web-02
```

## Challenges and Solutions

| Challenge | Solution |
|---|---|
| Finding research relevant to East Africa | Combined "cervical cancer" with the user's keywords and the selected country (or all eight EAC countries). |
| Handling searches with no results | Added a check for empty article ID lists and returned an empty results list. |
| Handling API failures | Added error handling so the application can display a useful message when PubMed is unavailable. |
| PubMed cannot sort results oldest-first | Offered *Newest first* and *Best match* instead, which PubMed supports. |
| A misspelled parameter (`maxidate`) made PubMed silently ignore the year filter | Noticed identical counts with and without the filter, then found the typo. |
| A missing quote in `script.js` stopped all the JavaScript | Used the browser DevTools Console to find the exact line. |
| SSH from my laptop was denied because my public and private keys didn't match | Rebuilt the public key with `ssh-keygen -y`. |
| My first domain pointed to web-01, skipping the load balancer | Chose www.alissamtoha.tech, which points to the load balancer rather than a single server. |

## Credits and References

- [PubMed – National Library of Medicine](https://pubmed.ncbi.nlm.nih.gov/)
- [NCBI E-utilities Documentation](https://www.ncbi.nlm.nih.gov/books/NBK25501/)
- [E-utilities Quick Start (beginner guide)](https://eutilities.github.io/site/Quick_Start/eu_quick/)
- [World Health Organization – Cervical Cancer](https://www.who.int/news-room/fact-sheets/detail/cervical-cancer)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Nginx](https://nginx.org/)
- [HAProxy](https://www.haproxy.org/)
- [PM2](https://pm2.keymetrics.io/)
