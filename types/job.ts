export interface IJob {
    jobTitle: string;
    providingCompany: string;
    jobDescription: string;
    jobDetails: string;
    qualifications: string[];
    benefits?: string[];
    contact: string
}

export type JobPreview = Omit<IJob, "jobDescription" | "jobDetails" | "contact" | "qualifications" | "benefits">
