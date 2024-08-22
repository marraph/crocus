import {db} from "@/database/drizzle";
import {task, team} from "@/schema";
import {eq} from "drizzle-orm";
import {
    ActionResult,
    createEntry,
    deleteEntity,
    Entity,
    NewEntity,
    queryEntity,
    UpdateEntity,
    updateEntry
} from "@/action/actions";

type Task = Entity<typeof task>
type NewTask = NewEntity<typeof task>
type UpdateTask = UpdateEntity<typeof task>

const createTask = async (newTask: NewTask) => createEntry(task, newTask)
const deleteTask = async (id: number) => deleteEntity(task, id, task.id)

const updateTask = async (
    id: number,
    updateTask: UpdateTask
) => updateEntry(task, updateTask, id, task.id)

const getTasksFromProject = async (
    projectId: number,
    limit: number
) => queryEntity(task, projectId, task.projectId, limit)

const getTasksFromTeam = async (
    teamId: number,
    projectLimit: number,
    taskPerProjectLimit: number
): Promise<ActionResult<Task[]>> => {
    try {
        const results: Task[] = []
        const projects = await db
            .select()
            .from(team)
            .where(eq(team.id, teamId))
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
    createTask,
    updateTask,
    deleteTask,
    getTasksFromProject,
    getTasksFromTeam
}