import {teamMembers, projects, tasks} from "@/schema";
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
import {db} from "@/database/drizzle";
import {eq} from "drizzle-orm";

type Project = Entity<typeof projects>
type NewProject = NewEntity<typeof projects>
type UpdateProject = UpdateEntity<typeof projects>

const getProject = async (id: number) => getEntity(projects, id, projects.id)

const createProject = async (
    newProject: NewProject
) => createEntry(projects, newProject)

const updateProject = async (
    id: number,
    updateProject: UpdateProject
) => updateEntry(projects, updateProject, id, projects.id)

const deleteProject = async (
    id: number
) => deleteEntity(projects, id, projects.id)

const getProjectsFromTeam = async (
    teamId: number,
    limit: number = 100
) => queryEntity(projects, teamId, projects.teamId, limit)

const getProjectsFromUser = async (
    userId: number,
    limit: number = 100
): Promise<ActionResult<Project[]>> => {
    try {

        const queryProjects = await db
            .select({
                id: projects.id,
                name: projects.name,
                description: projects.description,
                priority: projects.priority,
                isArchived: projects.isArchived,
                createdAt: projects.createdAt,
                updatedAt: projects.updatedAt,
                createdBy: projects.createdBy,
                updatedBy: projects.updatedBy,
                teamId: projects.teamId
            })
            .from(projects)
            .innerJoin(teamMembers, eq(projects.teamId, teamMembers.teamId))
            .where(eq(teamMembers.userId, userId))
            .limit(limit)

        if (!queryProjects || queryProjects.length == 0) {
            return {success: false, error: 'No projects found!'}
        }

        return {success: true, data: queryProjects}
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