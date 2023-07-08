import {scrapeSimplyHired} from "./scrappers/SimplyHired";


scrapeSimplyHired()
    .then(() => console.log("Scrapped successfully"))
    .catch(() => console.log("Scrapping was unsuccessful"));
