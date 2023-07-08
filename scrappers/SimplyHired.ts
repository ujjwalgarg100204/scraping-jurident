import puppeteer, {Browser, Page} from "puppeteer";
import {configPage} from "../utils";
import {IJob} from "../types";
import {writeJobs} from "../data";


const MAX_PAGES_SCRAPPED = 10;

export async function scrapeSimplyHired() {
    let browser: Browser | undefined;
    try {
        browser = await puppeteer.launch({headless: true, defaultViewport: null});
        const page = await browser.newPage();

        configPage(page);
        console.log("Browser started successfully");


        // all scraped jobs
        const jobs: IJob[] = [];
        for (let currentPage = 1; currentPage < MAX_PAGES_SCRAPPED; currentPage++) {
            // go to simplyHired page
            await page.goto(`https://www.simplyhired.co.in/search?q=company+contact+details+tech&pn=${currentPage}`);

            // wait for the list of jobs to render
            await page.waitForSelector(".SerpJob-jobCard");

            // scrape all the jobs
            const jobPreviewList = await page.evaluate(() => Array.from(document.querySelectorAll(".SerpJob-jobCard")));
            if (jobPreviewList === undefined) {
                console.log("No job found on this page");
                currentPage++;
                continue;
            }

            for (let i = 0; i < jobPreviewList.length; i++) {
                // click on the job preview card to render the job on browser
                await page.evaluate(index => {
                    const jobPreviewList = Array.from(document.querySelectorAll<HTMLDivElement>(".SerpJob-jobCard"));
                    jobPreviewList.at(index)?.click()
                }, i);

                const scrapedJob = await scrapeJob(page);
                console.log(`\tScrapped job ${i} on page ${currentPage}`);

                // push the scraped job to job's array
                jobs.push(scrapedJob);
            }

            console.log(`\nScrapped page ${currentPage}`)

            // increment scrapped page variable
            currentPage++;
        }

        // all the jobs have been scraped successfully
        await writeJobs(jobs);

        console.log("Jobs have been written successfully");
    } catch (err) {
        console.error(err);
    } finally {
        browser?.close();
    }
}

async function scrapeJob(page: Page): Promise<IJob> {
    const jobPanelSelector = "aside.rpContent";
    await page.waitForSelector(jobPanelSelector);


    return await page.evaluate(() => {
        const jobPanel = document.querySelector("aside.rpContent") as HTMLDivElement;

        // scrape job qualifications
        const qualifications = jobPanel.querySelector(".viewjob-qualifications");
        const qualificationList = qualifications
            ? Array.from(
                qualifications.querySelectorAll(".viewjob-qualification"),
                el => el.textContent || ""
            )
            : [];

        // scrape job benefits
        const benefits = jobPanel.querySelector(".viewjob-benefits");
        const benefitList: string[] = benefits
            ? Array.from(
                benefits.querySelectorAll(".viewjob-benefit"),
                el => el.textContent || ""
            )
            : [];

        // extract contact information from job description
        const jobDescription = document.querySelector(".viewjob-jobDescription > div")?.textContent || "";
        const contactInfo = jobDescription.includes("Speak with the employer")
            ? document.querySelector(".viewjob-jobDescription > div > :last-child")?.textContent || "" : ""

        return {
            jobTitle: document.querySelector(".viewjob-jobTitle")?.textContent || "",
            providingCompany: document.querySelector(".viewjob-header-companyInfo")?.textContent || "",
            jobDescription: jobDescription,
            jobDetails: document.querySelector(".viewjob-jobDetails")?.textContent || "",
            qualifications: qualificationList,
            benefits: benefitList,
            contact: contactInfo
        }

    })
}
