import {db} from "@/database/drizzle";
import {projects, tasks, teams, topics, users} from "@/schema";
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

type Task = Entity<typeof tasks>
type NewTask = NewEntity<typeof tasks>
type UpdateTask = UpdateEntity<typeof tasks>

const getTask = async (id: number) => getEntity(tasks, id, tasks.id)

const createTask = async (newTask: NewTask) => createEntry(tasks, newTask)
const deleteTask = async (id: number) => deleteEntity(tasks, id, tasks.id)

const updateTask = async (
    id: number,
    updateTask: UpdateTask
) => updateEntry(tasks, updateTask, id, tasks.id)

const getTasksFromProject = async (
    projectId: number,
    limit: number = 100
) => queryEntity(tasks, projectId, tasks.projectId, limit)

const getTasksFromUser = async (
    userId: number,
    limit: number = 100
) => queryEntity(tasks, userId, tasks.createdBy, limit)

const getTaskFromId = async (
    taskId: number
) => {

    try {
        const [currentTask] = await db
            .select()
            .from(tasks)
            .fullJoin(projects, eq(tasks.projectId, projects.id))
            .fullJoin(teams, eq(projects.teamId, teams.id))
            .fullJoin(topics, eq(tasks.topic, topics.id))
            .fullJoin(users, eq(tasks.createdBy, users.id))
            .fullJoin(users, eq(tasks.updatedBy, users.id))
            .where(eq(tasks.id, taskId))
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

        const queryTasks = await db
            .select({
                id: tasks.id,
                name: tasks.name,
                description: tasks.description,
                isArchived: tasks.isArchived,
                duration: tasks.duration,
                bookedDuration: tasks.bookedDuration,
                deadline: tasks.deadline,
                topic: tasks.topic,
                state: tasks.state,
                priority: tasks.priority,
                createdAt: tasks.createdAt,
                updatedAt: tasks.updatedAt,
                createdBy: tasks.createdBy,
                updatedBy: tasks.updatedBy,
                projectId: tasks.projectId
            })
            .from(tasks)
            .innerJoin(projects, eq(tasks.projectId, projects.id))
            .innerJoin(teams, eq(projects.teamId, teams.id))
            .where(eq(teams.id, teamId))
            .limit(limit)

        if (!queryTasks || queryTasks.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryTasks}

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