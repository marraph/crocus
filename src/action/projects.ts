import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";
import {project} from "@/schema";
import {db} from "@/database/drizzle";

export type Project = InferSelectModel<typeof project>
export type NewProject = InferInsertModel<typeof project>
export type UpdateProject = Partial<NewProject>

export const createProject = async (newProject: NewProject): Promise<Project> => {
    const [createdProject] = await db
        .insert(project)
        .values(newProject)
        .returning();

    return createdProject
}

export const updateProject = async (id: number, updateProject: UpdateProject): Promise<Project> => {
    const [updatedProject] = await db
        .update(project)
        .set(updateProject)
        .where(eq(project.id, id))
        .returning()

    return updatedProject
}

export const deleteProject = async (id: number) => {
    await db.delete(project).where(eq(project.id, id))
}

export const getProjectsFromTeam = async (teamId: number): Promise<Project[]> => {
    return db
        .select()
        .from(project)
        .where(eq(project.teamId, teamId));
}