import {members, team} from "@/schema";
import {createEntry, deleteEntity, Entity, NewEntity, queryEntity, UpdateEntity, updateEntry} from "@/action/actions";

type Team = Entity<typeof team>
type NewTeam = NewEntity<typeof team>
type UpdateTeam = UpdateEntity<typeof team>

const createTeam = async (newTeam: NewTeam) => createEntry(team, newTeam)

const deleteTeam = async (id: number) => {
    await deleteEntity(members, id, members.teamId)
    return await deleteEntity(team, id, team.id)
}

const updateTeam = async (
    id: number,
    updateTeam: UpdateTeam
) => updateEntry(team, updateTeam, id, team.id)

const getTeamsFromOrganisation = async (
    organisationId: number,
    limit: number
) => queryEntity(team, organisationId, team.organisationId, limit)

export type {
    Team,
    NewTeam,
    UpdateTeam
}

export {
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamsFromOrganisation
}