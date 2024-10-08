import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
    absenceRelations,
    absences, entries, entryRelations, organisationMemberRelations,
    organisationMembers, organisationRelations,
    organisations, projectRelations,
    projects, taskRelations,
    tasks, teamMemberRelations,
    teamMembers, teamRelations,
    teams, topicRelations,
    topics, userRelations,
    users
} from "@/schema";

const queryClient = postgres('postgresql://avnadmin:AVNS_NV0uRHW6UnKC_k_NdLD@marraph-1-speed.j.aivencloud.com:22482/calla2?sslmode=require')

export const db = drizzle(queryClient, {
    schema: {
        users,
        topics,
        tasks,
        projects,
        organisations,
        teams,
        teamMembers,
        organisationMembers,
        absences,
        entries,
        organisationRelations,
        teamRelations,
        projectRelations,
        taskRelations,
        organisationMemberRelations,
        teamMemberRelations,
        absenceRelations,
        entryRelations,
        userRelations,
        topicRelations
    }
});