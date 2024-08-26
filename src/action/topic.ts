import {topics} from "@/schema";
import {
    ActionResult,
    createEntity,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    UpdateEntity,
    updateEntity
} from "@/action/actions";
import {db} from "@/database/drizzle";
import type {DBQueryConfig} from "drizzle-orm/relations";

type Topic = Entity<typeof topics>
type NewTopic = NewEntity<typeof topics>
type UpdateTopic = UpdateEntity<typeof topics>

const getTopic = async (id: number) => getEntity(topics, id, topics.id)

const createTopic = async (newTopic: NewTopic) => createEntity(topics, newTopic)
const deleteTopic = async (id: number) => deleteEntity(topics, id, topics.id)

const updateTopic = async (
    id: number,
    updateTopic: UpdateTopic
) => updateEntity(topics, updateTopic, id, topics.id)

const queryTopic = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<Topic>> => {
    try {

        const queryTopic = await db.query.topics.findFirst(config)

        if (!queryTopic) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryTopic}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const queryTopics = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<Topic[]>> => {
    try {

        const queryTopics = await db.query.topics.findMany(config)

        if (!queryTopics || queryTopics.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryTopics}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export type {
    Topic,
    NewTopic,
    UpdateTopic
}

export {
    getTopic,
    createTopic,
    deleteTopic,
    updateTopic,
    queryTopic,
    queryTopics
}