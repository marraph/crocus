import {useDelete, useGet, usePost, useUpdate} from "@/service/genericDataService";
import {Task} from "@/types/types";

const URL = "http://localhost:8080/api/v1/task"

const getTask = (id: number) => useGet<Task>(URL, id)
const updateTask = (id: number, task: Task) => useUpdate<Task>(URL, id, task)
const deleteTask = (id: number) => useDelete(URL, id)
const createTask = (task: Task) => usePost<Task>(URL, task)

export {
    getTask,
    updateTask,
    deleteTask,
    createTask
}