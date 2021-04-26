declare namespace NodeJS {
  export interface ProcessEnv {
    GITHUB_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    ACCESS_TOKEN_SECRET: string;
    DATABASE_URL: string;
    NODE_ENV: 'development' | 'production';
    USERNAME: string;
    PASSWORD: string;
    DATABASE: string;
    SSL_ON: boolean
  }
}
