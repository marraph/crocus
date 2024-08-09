import {user} from "@/schema";
import {eq} from "drizzle-orm";
import {db} from "@/database/drizzle";

export const createUser = async (name: string, email: string) => {
    const [createdUser] = await db
        .insert(user)
        .values({email: email, name: name})
        .returning()

    return createdUser
}

export const updateUser = async (id: number, name: string) => {
    const [updatedUser] = await db
        .update(user)
        .set({name: name})
        .where(eq(user.id, id))
        .returning()

    return updatedUser
}

export const deleteUser = async (id: number) => {
    await db.delete(user).where(eq(user.id, id))
}

export const getUser = async (id: number) => {
    const [foundUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, id))

    return foundUser
}