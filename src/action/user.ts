import {user} from "@/schema";
import {eq} from "drizzle-orm";
import {db} from "@/database/drizzle";

export const createUser = async (name: string, email: string) => {
    return db.insert(user).values({
        email: email,
        name: name
    }).returning();
}

export const updateUser = async (id: number, name: string) => {
    await db.update(user).set({
        name: name
    }).where(eq(user.id, id))
}

export const deleteUser = async (id: number) => {
    await db.delete(user).where(eq(user.id, id))
}

export const getUser = async (id: number) => {
    await db.select().from(user).where(eq(user.id, id))
}