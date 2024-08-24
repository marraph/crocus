import {members, project, task} from "@/schema";
import {
    ActionResult,
    createEntry,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    queryEntity,
    UpdateEntity,
    updateEntry
} from "@/action/actions";
import {eq} from "drizzle-orm";
import {db} from "@/database/drizzle";

type Project = Entity<typeof project>
type NewProject = NewEntity<typeof project>
type UpdateProject = UpdateEntity<typeof project>

const getProject = async (id: number) => getEntity(project, id, project.id)

const createProject = async (
    newProject: NewProject
) => createEntry(project, newProject)

const updateProject = async (
    id: number,
    updateProject: UpdateProject
) => updateEntry(project, updateProject, id, project.id)

const deleteProject = async (
    id: number
) => deleteEntity(project, id, project.id)

const getProjectsFromTeam = async (
    teamId: number,
    limit: number = 100
) => queryEntity(project, teamId, project.teamId, limit)


const getProjectsFromUser = async (
    userId: number,
    limit: number = 100
): Promise<ActionResult<Project[]>> => {
    try {

        const projects = await db
            .select({
                id: project.id,
                name: project.name,
                description: project.description,
                priority: project.priority,
                isArchived: project.isArchived,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                createdBy: project.createdBy,
                updatedBy: project.updatedBy,
                teamId: project.teamId
            })
            .from(project)
            .innerJoin(members, eq(project.teamId, members.teamId))
            .where(eq(members.userId, userId))
            .limit(limit)

        if (!projects || projects.length == 0) {
            return {success: false, error: 'No projects found!'}
        }

        return {success: true, data: projects}
    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }

}


export type {
    Project,
    NewProject,
    UpdateProject
}

export {
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectsFromTeam,
    getProjectsFromUser
}