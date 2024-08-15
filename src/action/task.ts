import {db} from "@/database/drizzle";
import {task} from "@/schema";
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

export const getTasksFromTeam = async (projectId: number): Promise<Task[]> => {
        return db
            .select()
            .from(task)
            .where(eq(task.projectId, projectId));
}