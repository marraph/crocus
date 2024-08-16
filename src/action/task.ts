import {db} from "@/database/drizzle";
import {project, task, team} from "@/schema";
import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";

export type Task = InferSelectModel<typeof task>
export type NewTask = InferInsertModel<typeof task>
export type UpdateTask = Partial<NewTask>

export const createTask = async (newTask: NewTask): Promise<Task> => {
    const [createdTask] = await db
        .insert(task)
        .values(newTask)
        .returning();

    return createdTask
}

export const updateTask = async (id: number, updateTask: UpdateTask): Promise<Task> => {
    const [updatedTask] = await db
        .update(task)
        .set(updateTask)
        .where(eq(task.id, id))
        .returning()

    return updatedTask
}

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