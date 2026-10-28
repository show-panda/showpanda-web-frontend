type EnvironmentConfig = {
  apiURL: string;
};

const config: EnvironmentConfig = {
  apiURL: process.env.NEXT_PUBLIC_API_URL || "",
};

export default config;
