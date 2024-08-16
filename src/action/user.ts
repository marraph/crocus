import {user} from "@/schema";
import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";
import {db} from "@/database/drizzle";

export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>
export type UpdateUser = Partial<NewUser>

export const createUser = async (newUser: NewUser): Promise<User> => {
    const [createdUser] = await db
        .insert(user)
        .values({email: newUser.name, name: newUser.name})
        .returning()

    return createdUser
}

export const updateUser = async (id: number, updateUser: UpdateUser): Promise<User> => {
    const [updatedUser] = await db
        .update(user)
        .set(updateUser)
        .where(eq(user.id, id))
        .returning()

    return updatedUser
}

export const deleteUser = async (id: number) => {
    await db.delete(user).where(eq(user.id, id))
}

export const getUser = async (id: number): Promise<User> => {
    const [foundUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, id))

    return foundUser
}