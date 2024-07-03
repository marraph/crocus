import {useDelete, useGet, usePost, useUpdate} from "@/service/genericDataService";
import {Absence, TimeEntry} from "@/types/types";

const URL = "http://localhost:8080/api/v1/absence"

const getAbsence = (id: number) => useGet<Absence>(URL, id)
const updateAbsence = (id: number, absence: Absence) => useUpdate<Absence>(URL, id, absence)
const deleteAbsence = (id: number) => useDelete(URL, id)
const createAbsence = (absence: Absence) => usePost<Absence>(URL, absence)

export {
    getAbsence,
    updateAbsence,
    deleteAbsence,
    createAbsence
}