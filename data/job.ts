import fs from "fs/promises";
import path from "path";
import {IJob} from "../types";

export function getJobFilePath() {
    return path.join(__dirname, "..", "..", "data-files", "jobs.json");
}

export async function getJobs(): Promise<IJob[]> {
    return JSON.parse(
        await fs.readFile(
            getJobFilePath(), "utf-8"
        )
    ) as IJob[]
}

export async function writeJobs(jobs: IJob[]) {
    // old jobs in the file
    const oldJobs = await getJobs();

    return await fs.writeFile(
        getJobFilePath(),
        JSON.stringify([...oldJobs, ...jobs]),
        {encoding: "utf-8"}
    );
}

export async function writeJob(job: IJob) {
    // old jobs in the file
    const oldJobs = await getJobs();

    return await fs.writeFile(
        getJobFilePath(),
        JSON.stringify([...oldJobs, job]),
        {encoding: "utf-8"}
    );
}

