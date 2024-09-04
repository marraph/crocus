'use server'

import {projects} from "@/schema";
import {
    ActionResult,
    createEntity,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    UpdateEntity,
    updateEntity
} from "@/action/actions";
import {db} from "@/database/drizzle";
import type {DBQueryConfig} from "drizzle-orm/relations";
import {NewProject, Project, UpdateProject} from "@/types/types";

const getProject = async (id: number) => getEntity(projects, id, projects.id)

const createProject = async (
    newProject: NewProject
) => createEntity(projects, newProject)

const updateProject = async (
    id: number,
    updateProject: UpdateProject
) => updateEntity(projects, updateProject, id, projects.id)

const deleteProject = async (
    id: number
) => deleteEntity(projects, id, projects.id)

const queryProject = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<Project>> => {
    try {

        const queryTasks = await db.query.projects.findFirst(config)

        if (!queryTasks) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryTasks}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const queryProjects = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<Project[]>> => {
    try {

        const queryTasks = await db.query.projects.findMany(config)

        if (!queryTasks || queryTasks.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryTasks}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export {
    getProject,
    createProject,
    updateProject,
    deleteProject,
    queryProject,
    queryProjects
}