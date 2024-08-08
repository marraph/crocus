import {drizzle} from "drizzle-orm/d1";
import postgres from "postgres";

const queryClient = postgres('postgresql://avnadmin:AVNS_NV0uRHW6UnKC_k_NdLD@marraph-1-speed.j.aivencloud.com:22482/calla')

export const db = drizzle(queryClient);
