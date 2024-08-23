import {members, team, topic} from "@/schema";
import {
    ActionResult,
    createEntry,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    queryEntity,
    UpdateEntity,
    updateEntry
} from "@/action/actions";
import {db} from "@/database/drizzle";
import {eq} from "drizzle-orm";

type Topic = Entity<typeof topic>
type NewTopic = NewEntity<typeof topic>
type UpdateTopic = UpdateEntity<typeof topic>

const getTopic = async (id: number) => getEntity(topic, id, topic.id)

const createTopic = async (newTopic: NewTopic) => createEntry(topic, newTopic)
const deleteTopic = async (id: number) => deleteEntity(topic, id, topic.id)

const updateTopic = async (
    id: number,
    updateTopic: UpdateTopic
) => updateEntry(topic, updateTopic, id, topic.id)

const getTopicsFromTeam = async (
    teamId: number,
    limit: number = 100
) => queryEntity(topic, teamId, topic.teamId, limit)

const getTopicsFromUser = async (
    userId: number,
    limit: number = 100
): Promise<ActionResult<Topic[]>> => {
    try {

        const rawTopics = await db
            .select({
                id: topic.id,
                name: topic.name,
                hexCode: topic.hexCode,
                teamId: topic.teamId,
                createdBy: topic.createdBy,
                createdAt: topic.createdAt,
                updatedBy: topic.updatedBy,
                updatedAt: topic.updatedAt
            })
            .from(members)
            .fullJoin(topic, eq(topic.teamId, members.teamId))
            .where(eq(members.userId, userId))
            .limit(limit)

        if (!rawTopics || rawTopics.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        const topics = rawTopics.filter((t): t is Topic => !t.id && !t.name && !t.hexCode && !t.teamId && !t.updatedBy && !t.updatedAt && !t.createdBy && !t.createdAt)
        return {success: true, data: topics}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const getTopicsFromOrganisation = async (
    organisationId: number,
    limit: number = 100
): Promise<ActionResult<Topic[]>> => {
    try {

        const rawTopics = await db
            .select({
                id: topic.id,
                name: topic.name,
                hexCode: topic.hexCode,
                teamId: topic.teamId,
                createdBy: topic.createdBy,
                createdAt: topic.createdAt,
                updatedBy: topic.updatedBy,
                updatedAt: topic.updatedAt
            })
            .from(team)
            .fullJoin(topic, eq(topic.teamId, team.id))
            .where(eq(team.organisationId, organisationId))
            .limit(limit)

        if (!rawTopics || rawTopics.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        const topics = rawTopics.filter((t): t is Topic => !t.id && !t.name && !t.hexCode && !t.teamId && !t.updatedBy && !t.updatedAt && !t.createdBy && !t.createdAt)
        return {success: true, data: topics}

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
    getTopicsFromTeam,
    getTopicsFromUser,
    getTopicsFromOrganisation
}