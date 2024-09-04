'use server'

import {db} from "@/database/drizzle";
import {tasks} from "@/schema";
import {
    ActionResult,
    createEntity,
    deleteEntity,
    Entity, getEntity,
    NewEntity,
    UpdateEntity,
    updateEntity
} from "@/action/actions";
import type {DBQueryConfig} from "drizzle-orm/relations";
import {NewTask, Task, UpdateTask} from "@/types/types";

const getTask = async (id: number) => getEntity(tasks, id, tasks.id)

const createTask = async (newTask: NewTask) => createEntity(tasks, newTask)
const deleteTask = async (id: number) => deleteEntity(tasks, id, tasks.id)

const updateTask = async (
    id: number,
    updateTask: UpdateTask
) => updateEntity(tasks, updateTask, id, tasks.id)

const queryTask = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<Task>> => {
    try {

        const queryTask = await db.query.tasks.findFirst(config)

        if (!queryTask) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryTask}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const queryTasks = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<Task[]>> => {
    try {

        const queryTasks = await db.query.tasks.findMany(config)

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
    getTask,
    createTask,
    updateTask,
    deleteTask,
    queryTask,
    queryTasks
}