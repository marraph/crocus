import {topic} from "@/schema";
import {
    createEntry,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    queryEntity,
    UpdateEntity,
    updateEntry
} from "@/action/actions";

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
    getTopicsFromTeam
}