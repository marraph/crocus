import {topic} from "@/schema";
import {db} from "@/database/drizzle";
import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";

export type Topic = InferSelectModel<typeof topic>
export type NewTopic = InferInsertModel<typeof topic>
export type UpdateTopic = Partial<NewTopic>

export const createTopic = async (newTopic: NewTopic): Promise<Topic> => {
    const [createdTopic] = await db
        .insert(topic)
        .values(newTopic)
        .returning()

    return createdTopic
}

export const updateTopic = async (id: number, updateTopic: UpdateTopic): Promise<Topic> => {
    const [updatedTopic] = await db
        .update(topic)
        .set(updateTopic)
        .where(eq(topic.id, id))
        .returning()

    return updatedTopic
}

export const deleteTopic = async (id: number) => {
    await db.delete(topic).where(eq(topic.id, id))
}

export const getTopicsFromTeam = async (teamId: number): Promise<Topic[]> => {
    return db
        .select()
        .from(topic)
        .where(eq(topic.teamId, teamId));
}