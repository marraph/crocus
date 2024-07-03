import {useDelete, useGet, usePost, useUpdate} from "@/service/genericDataService";
import {TimeEntry} from "@/types/types";

const URL = "http://localhost:8080/api/v1/timeentry"

const getTimeEntry = (id: number) => useGet<TimeEntry>(URL, id)
const updateTimEntry = (id: number, timeEntry: TimeEntry) => useUpdate<TimeEntry>(URL, id, timeEntry)
const deleteTimeEntry = (id: number) => useDelete(URL, id)
const createTimeEntry = (timeEntry: TimeEntry) => usePost<TimeEntry>(URL, timeEntry)

export {
    getTimeEntry,
    updateTimEntry,
    deleteTimeEntry,
    createTimeEntry
}