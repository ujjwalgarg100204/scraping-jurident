import {Browser, Page} from "puppeteer";

import {ILawyer} from "../types";
import {delay} from "./utils";


export async function signInLinkedin(page: Page) {
    try {
        await page.type("#session_key", process.env.LINKEDIN_USERNAME);
        await page.type("#session_password", process.env.LINKEDIN_PASSWORD);
        await page.click("button.btn-primary");
        console.log("%cSigned in successfully", "color: green");
    } catch (e) {
        console.log("%cError occurred, sign in manually, (waiting for 10 secs)", "color: #B70404");
        await delay(10_000);
    }
}

export async function searchForLawyer(
    lawyerName: string,
    browser: Browser
): Promise<ILawyer | null> {
    console.dir(`Searching profile for ${lawyerName}`, {colors: "#469AEC"})
    let lawyerSearchPage: Page | undefined;
    try {
        lawyerSearchPage = await browser.newPage();

        console.log(`\t%cSelect valid profile now (waiting for 10 secs)`, "color: #958E65");

        await lawyerSearchPage.goto(
            `https://www.linkedin.com/search/results/people/?keywords=${lawyerName
                .split(" ")
                .join("%20")}%20Advocate&sid=NS*`
        );

        await delay(12_000);

        // if result container is present, then no valid profile is found

        await lawyerSearchPage.waitForSelector(".search-results-container", {
            timeout: 2000,
        });
        console.log(`\t%cUser couldn't find a viable profile, moving to next lawyer`, "color: #F24C3D");
    } catch (err) {
        const lawyerProfile = await scrapeLawyerDetails(lawyerSearchPage!);
        console.dir(lawyerProfile, {compact: true, sorted: true, colors: "#cdcdcd"});
        return lawyerProfile;
    } finally {
        lawyerSearchPage?.close();
    }
    return null;
}

export async function scrapeLawyerDetails(page: Page): Promise<ILawyer> {

    try {
        const name = await page.evaluate(() => {
            const element = document.querySelector('.text-heading-xlarge.inline.t-24.v-align-middle.break-words');
            return element?.textContent?.trim() || "";
        });
        const imageUrl =
            (await page.$eval(".pv-top-card-profile-picture__image", element =>
                element.getAttribute("src")
            )) || "";

        let desc = await page.evaluate(() => {
            const element = document.querySelector(".text-body-medium.break-words");
            return element?.textContent?.trim() || "";
        });
        const location = await page.evaluate(() => {
            const element = document.querySelector(
                ".text-body-small.inline.t-black--light.break-words"
            );
            return element?.textContent?.trim() || "";
        });

        // if about section exits then, change linked in description to that
        const aboutExists = await page.$('#about');
        if (aboutExists) {
            desc = await page.evaluate(() => {
                const aboutElement = document.querySelector('.pv-shared-text-with-see-more .inline-show-more-text');
                return aboutElement?.textContent?.trim() || desc;
            });
        }


        return {
            name,
            location,
            linkedinDesc: desc,
            type: "",
            profileImageURL: imageUrl,
        };
    } catch (err) {
        console.log("%c**Error while scraping data**", "color: #B70404")
        console.dir(err, {color: "#B70404"})
        return {name: "", location: ""}
    }
}
