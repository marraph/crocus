import {db} from "@/database/drizzle";
import {project, task, team} from "@/schema";
import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";
import {createEntry, deleteEntity, Entity, NewEntity, UpdateEntity, updateEntry} from "@/action/actions";

export type Task = Entity<typeof task>
export type NewTask = NewEntity<typeof task>
export type UpdateTask = UpdateEntity<typeof task>

export const createTask = (newTask: NewTask) => createEntry(task, newTask)
export const updateTask = (id: number, updateTask: UpdateTask) => updateEntry(task, updateTask, id, task.id)
export const deleteTask = async (id: number) => deleteEntity(task, id, task.id)

export const deleteTask = async (id: number) => {
    await db.delete(task).where(eq(task.id, id))
}

export const getTasksFromProject = async (projectId: number): Promise<Task[]> => {
    return db
        .select()
        .from(task)
        .where(eq(task.projectId, projectId));
}

export const getTasksFromTeam = async (teamId: number): Promise<Task[]> => {
    const result: Task[] = []
    const projects = await db
        .select()
        .from(team)
        .where(eq(team.id, teamId));

    for (const currentProject of projects) {
        const tasks = await db
            .select()
            .from(task)
            .where(eq(project.id, currentProject.id))

        for (const task of tasks) result.push(task)
    }

    return result
}