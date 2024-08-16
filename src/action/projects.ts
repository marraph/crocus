import {eq} from "drizzle-orm";
import {project} from "@/schema";
import {db} from "@/database/drizzle";
import {ActionResult, createEntry, deleteEntity, Entity, NewEntity, UpdateEntity, updateEntry} from "@/action/actions";

export type Project = Entity<typeof project>
export type NewProject = NewEntity<typeof project>
export type UpdateProject = UpdateEntity<typeof project>

export const createProject = (newProject: NewProject) => createEntry(project, newProject)
export const updateProject = (id: number, updateProject: UpdateProject) => updateEntry(project, updateProject, id, project.id)
export const deleteProject = (id: number) => deleteEntity(project, id, project.id)

export const getProjectsFromTeam = async (teamId: number, limit: number = 100): Promise<ActionResult<Project[]>> => {
    try {
        const projects = await db
            .select()
            .from(project)
            .where(eq(project.teamId, teamId))
            .limit(limit)

        if (!projects) {
            return {success: false, error: 'Failed to get projects'}
        }

        if (!projects) {
            return {success: false, error: 'Found no teams'}
        }

        return {success: true, data: projects}
    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}