import {project, task} from "@/schema";
import {
    createEntry,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    queryEntity,
    UpdateEntity,
    updateEntry
} from "@/action/actions";

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
    getProjectsFromTeam
}