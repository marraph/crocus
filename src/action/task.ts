import {db} from "@/database/drizzle";
import {priority, project, state, task, team, topic, user} from "@/schema";
import {eq} from "drizzle-orm";
import {
    ActionResult,
    createEntry,
    deleteEntity,
    Entity, getEntity,
    NewEntity,
    queryEntity,
    UpdateEntity,
    updateEntry
} from "@/action/actions";
import {boolean, doublePrecision, integer, serial, text, timestamp} from "drizzle-orm/pg-core";

type Task = Entity<typeof task>
type NewTask = NewEntity<typeof task>
type UpdateTask = UpdateEntity<typeof task>

const getTask = async (id: number) => getEntity(task, id, task.id)

const createTask = async (newTask: NewTask) => createEntry(task, newTask)
const deleteTask = async (id: number) => deleteEntity(task, id, task.id)

const updateTask = async (
    id: number,
    updateTask: UpdateTask
) => updateEntry(task, updateTask, id, task.id)

const getTasksFromProject = async (
    projectId: number,
    limit: number = 100
) => queryEntity(task, projectId, task.projectId, limit)

const getTasksFromUser = async (
    userId: number,
    limit: number = 100
) => queryEntity(task, userId, task.createdBy, limit)

const getTaskFromId = async (
    taskId: number
) => {

    try {
        const [currentTask] = await db
            .select()
            .from(task)
            .fullJoin(project, eq(task.projectId, project.id))
            .fullJoin(team, eq(project.teamId, team.id))
            .fullJoin(topic, eq(task.topic, topic.id))
            .fullJoin(user, eq(task.createdBy, user.id))
            .fullJoin(user, eq(task.updatedBy, user.id))
            .where(eq(task.id, taskId))
            .limit(1)

        if (!currentTask) {
            return {success: false, error: 'Found no task with this Id'}
        }

        return {success: true, data: currentTask}
    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const getTasksFromTeam = async (
    teamId: number,
    limit: number = 100
): Promise<ActionResult<Task[]>> => {
    try {

        const tasks = await db
            .select({
                id: task.id,
                name: task.name,
                description: task.description,
                isArchived: task.isArchived,
                duration: task.duration,
                bookedDuration: task.bookedDuration,
                deadline: task.deadline,
                topic: task.topic,
                state: task.state,
                priority: task.priority,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
                createdBy: task.createdBy,
                updatedBy: task.updatedBy,
                projectId: task.projectId
            })
            .from(task)
            .innerJoin(project, eq(task.projectId, project.id))
            .innerJoin(team, eq(project.teamId, team.id))
            .where(eq(team.id, teamId))
            .limit(limit)

        if (!tasks || tasks.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: tasks}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export type {
    Task,
    NewTask,
    UpdateTask
}

export {
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskFromId,
    getTasksFromProject,
    getTasksFromTeam,
    getTasksFromUser
}