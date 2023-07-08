export interface ILawyer {
    type?:
        | "civil"
        | "criminal"
        | "taxation"
        | "divorce"
        | "general corporate"
        | "banking/finance"
        | "cyber crime"
        | "real estate"
        | "copyright"
        | "public prosecutor"
        | string;
    profileImageURL?: string;
    linkedinDesc?: string;
    location: string;
    name: string;
}
