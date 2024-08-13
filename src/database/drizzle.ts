import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres('postgresql://avnadmin:AVNS_NV0uRHW6UnKC_k_NdLD@marraph-1-speed.j.aivencloud.com:22482/calla?sslmode=require')

export const db = drizzle(queryClient);