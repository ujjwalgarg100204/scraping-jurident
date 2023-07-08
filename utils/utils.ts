import {Page} from "puppeteer";

export function delay(time: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

export function configPage(page: Page) {
    page.setDefaultTimeout(60 * 1000);
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
}