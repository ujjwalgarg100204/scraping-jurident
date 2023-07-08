import puppeteer, {Browser} from "puppeteer";
import "dotenv/config";
import {configPage, searchForLawyer, signInLinkedin} from "../utils";
import {getLawyerName, writeLawyer} from "../data";


export async function scrapeLinkedin() {
    let browser: Browser | undefined;
    try {
        browser = await puppeteer.launch({headless: false, defaultViewport: null});
        const page = await browser.newPage();

        // configure page
        configPage(page);

        console.log("%cBrowser started successfully", "color: green");

        await page.goto("https://www.linkedin.com/");
        await page.waitForSelector("h1.main-heading");
        console.log("%cLinkedin loaded successfully", "color: green");

        await signInLinkedin(page);

        // wait for search bar to appear
        await page.waitForSelector(".search-global-typeahead__input");

        // search for each lawyer in different tab
        const lawyers = await getLawyerName();
        for (const lawyer of lawyers) {
            const scrappedLawyer = await searchForLawyer(lawyer, browser);
            if (scrappedLawyer) await writeLawyer(scrappedLawyer);
            console.log(`%cOnly ${lawyers.length - lawyers.indexOf(lawyer) - 1} left\n`, "color: #cdcdcd")
        }
    } catch (err) {
        console.log(err);
    } finally {
        browser?.close();
    }
}