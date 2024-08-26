import {teamMembers, projects, teams} from "@/schema";
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

type Team = Entity<typeof teams>
type NewTeam = NewEntity<typeof teams>
type UpdateTeam = UpdateEntity<typeof teams>

const getTeam = async (id: number) => getEntity(teams, id, teams.id)

const createTeam = async (newTeam: NewTeam) => createEntry(teams, newTeam)

const deleteTeam = async (id: number) => {
    await deleteEntity(teamMembers, id, teamMembers.teamId)
    return await deleteEntity(teams, id, teams.id)
}

const updateTeam = async (
    id: number,
    updateTeam: UpdateTeam
) => updateEntry(teams, updateTeam, id, teams.id)

const getTeamsFromOrganisation = async (
    organisationId: number,
    limit: number
) => queryEntity(teams, organisationId, teams.organisationId, limit)

export type {
    Team,
    NewTeam,
    UpdateTeam
}

export {
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamsFromOrganisation
}