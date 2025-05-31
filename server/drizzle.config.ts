// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  // dbCredentials 객체 안에 'url' 속성을 추가하고 SQLite 파일 경로를 명시합니다.
  dbCredentials: {
    url: "sqlite.db", // <-- 이 부분을 추가합니다.
  },
  verbose: true,
  strict: true,
} satisfies Config;