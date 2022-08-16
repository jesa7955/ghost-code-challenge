export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_DATABASE: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_ADDR: string;
      DB_PORT: string;
      DB_COMMENTS_TABLE: string;
      DB_USERS_TABLE: string;
    }
  }
}
