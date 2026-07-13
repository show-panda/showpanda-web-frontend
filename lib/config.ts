type EnvironmentConfig = {
  apiURL: string;
  siteUrl: string;
};

const config: EnvironmentConfig = {
  apiURL: process.env.NEXT_PUBLIC_API_URL || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
};

export default config;
