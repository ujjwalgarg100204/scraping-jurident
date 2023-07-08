export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            LINKEDIN_USERNAME: string;
            LINKEDIN_PASSWORD: string;
        }
    }
}
