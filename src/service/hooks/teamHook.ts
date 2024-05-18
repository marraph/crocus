import {useDelete, useGet, usePost, useUpdate} from "@/service/genericDataService";
import {Team} from "@/types/types";

const URL = "http://localhost:8080/api/v1/team"

const getTeam = (id: number) => useGet<Team>(URL, id)
const updateTeam = (id: number, team: Team) => useUpdate<Team>(URL, id, team)
const deleteTeam = (id: number) => useDelete(URL, id)
const createTeam = (team: Team) => usePost<Team>(URL, team)

export {
    getTeam,
    updateTeam,
    deleteTeam,
    createTeam
}