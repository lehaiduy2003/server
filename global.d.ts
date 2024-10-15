declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_KEY: string;
      DATABASE_URL: string;
      STRIPE_SECRET_KEY: string;
      NODE_ENV: "development" | "production" | "test";
      PORT?: string;
      HOST?: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
    }
  }
}
export {};
