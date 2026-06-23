type EnvironmentConfig = {
  apiURL: string;
  siteUrl: string;
};

const developmentConfig: EnvironmentConfig = {
  apiURL: process.env.NEXT_PUBLIC_API_URL_STAGE || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
};

const productionConfig: EnvironmentConfig = {
  apiURL: process.env.NEXT_PUBLIC_API_URL_PROD || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
};

const config = developmentConfig; // STAGE
// const config = productionConfig;           // PROD
export default config;
