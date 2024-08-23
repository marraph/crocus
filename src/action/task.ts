import {db} from "@/database/drizzle";
import {project, task, team, topic, user} from "@/schema";
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
    taskId: number,
    projectLimit: number,
    taskPerProjectLimit: number
): Promise<ActionResult<Task[]>> => {
    try {
        const results: Task[] = []
        const projects = await db
            .select()
            .from(team)
            .where(eq(team.id, taskId))
            .limit(projectLimit);

        if (projects.length == 0) {
            return {success: false, error: 'Found no projects with this id'}
        }

        for (const project of projects) {
            const tasks = await getTasksFromProject(project.id, taskPerProjectLimit)

            if (!tasks.success) {
                return {success: false, error: tasks.error}
            }

            results.push(...tasks.data)
        }

        if (results.length == 0) {
            return {success: false, error: 'Found no tasks'}
        }

        return {success: true, data: results}

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