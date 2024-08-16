import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";
import {team} from "@/schema";
import {db} from "@/database/drizzle";

export type Team = InferSelectModel<typeof team>
export type NewTeam = InferInsertModel<typeof team>
export type UpdateTeam = Partial<NewTeam>

export const createTeam = async (newTeam: NewTeam): Promise<Team> => {
    const [createdTeam] = await db
        .insert(team)
        .values(newTeam)
        .returning();

    return createdTeam
}

export const updateTeam = async (id: number, updateTeam: UpdateTeam): Promise<Team> => {
    const [updatedTeam] = await db
        .update(team)
        .set(updateTeam)
        .where(eq(team.id, id))
        .returning()

    return updatedTeam
}

export const deleteTeam = async (id: number) => {
    await db.delete(team).where(eq(team.id, id))
}

export const getTeamsFromOrganisation = async (organisationId: number): Promise<Team[]> => {
    return db
        .select()
        .from(team)
        .where(eq(team.organisationId, organisationId));
}