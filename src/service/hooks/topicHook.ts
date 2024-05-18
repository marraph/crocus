import {useDelete, useGet, usePost, useUpdate} from "@/service/genericDataService";
import {Topic} from "@/types/types";

const URL = "http://localhost:8080/api/v1/topic"

const getTopic = (id: number) => useGet<Topic>(URL, id)
const updateTopic = (id: number, topic: Topic) => useUpdate<Topic>(URL, id, topic)
const deleteTopic = (id: number) => useDelete(URL, id)
const createTopic = (topic: Topic) => usePost<Topic>(URL, topic)

export {
    getTopic,
    updateTopic,
    deleteTopic,
    createTopic
}