import {teamMembers, teams, topics} from "@/schema";
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

type Topic = Entity<typeof topics>
type NewTopic = NewEntity<typeof topics>
type UpdateTopic = UpdateEntity<typeof topics>

const getTopic = async (id: number) => getEntity(topics, id, topics.id)

const createTopic = async (newTopic: NewTopic) => createEntry(topics, newTopic)
const deleteTopic = async (id: number) => deleteEntity(topics, id, topics.id)

const updateTopic = async (
    id: number,
    updateTopic: UpdateTopic
) => updateEntry(topics, updateTopic, id, topics.id)

const getTopicsFromTeam = async (
    teamId: number,
    limit: number = 100
) => queryEntity(topics, teamId, topics.teamId, limit)

const getTopicsFromUser = async (
    userId: number,
    limit: number = 100
): Promise<ActionResult<Topic[]>> => {
    try {

        const queryTopics = await db
            .select({
                id: topics.id,
                name: topics.name,
                hexCode: topics.hexCode,
                teamId: topics.teamId,
                createdBy: topics.createdBy,
                createdAt: topics.createdAt,
                updatedBy: topics.updatedBy,
                updatedAt: topics.updatedAt
            })
            .from(topics)
            .innerJoin(teamMembers, eq(topics.teamId, teamMembers.teamId))
            .where(eq(teamMembers.userId, userId))
            .limit(limit)

        if (!queryTopics || queryTopics.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryTopics}

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

        const queryTopics = await db
            .select({
                id: topics.id,
                name: topics.name,
                hexCode: topics.hexCode,
                teamId: topics.teamId,
                createdBy: topics.createdBy,
                createdAt: topics.createdAt,
                updatedBy: topics.updatedBy,
                updatedAt: topics.updatedAt
            })
            .from(topics)
            .innerJoin(teams, eq(topics.teamId, teams.id))
            .where(eq(teams.organisationId, organisationId))
            .limit(limit)

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
    getTopicsFromTeam,
    getTopicsFromUser,
    getTopicsFromOrganisation
}