import fs from "fs/promises";
import { ILawyer } from "../types";
import path from "path";

export async function getLawyerName() {
  return JSON.parse(
    await fs.readFile(
      path.join(__dirname, "..", "..", "data", "lawyers-name.json"),
      "utf-8"
    )
  ) as string[];
}

export async function getScrapedLawyerDetails() {
  return JSON.parse(
    await fs.readFile(
      path.join(__dirname, "..", "..", "data", "scraped-data.json"),
      "utf-8"
    )
  ) as ILawyer[];
}

export async function writeLawyer(lawyer: ILawyer) {
  const existingLawyers = await getScrapedLawyerDetails();
  existingLawyers.push(lawyer);

  return await fs.writeFile(
    path.join(__dirname, "..", "..", "data", "scraped-data.json"),
    JSON.stringify(existingLawyers),
    { encoding: "utf-8" }
  );
}

