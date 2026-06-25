type EnvironmentConfig = {
  apiURL: string;
  siteUrl: string;
};

const productionConfig: EnvironmentConfig = {
  apiURL: process.env.NEXT_PUBLIC_API_URL || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
};

// const config = developmentConfig;          // STAGE
const config = productionConfig; // PROD
export default config;
