import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: "postgresql://avnadmin:AVNS_NV0uRHW6UnKC_k_NdLD@marraph-1-speed.j.aivencloud.com:22482/calla?sslmode=require"
    }
});