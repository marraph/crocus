import {teamMembers, organisations, teams, users} from "@/schema";
import {
    ActionResult,
    createEntry,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    UpdateEntity,
    updateEntry
} from "@/action/actions";
import {db} from "@/database/drizzle";
import {eq} from "drizzle-orm";

type Organisation = Entity<typeof organisations>
type NewOrganisation = NewEntity<typeof organisations>
type UpdateOrganisation = UpdateEntity<typeof organisations>

const createOrganisation = async (
    newOrganisation: NewOrganisation
) => createEntry(organisations, newOrganisation)

const updateOrganisation = async (
    id: number,
    updateOrganisation: UpdateOrganisation
) => updateEntry(organisations, updateOrganisation, id, organisations.id)

const deleteOrganisation = async (
    id: number
) => deleteEntity(organisations, id, organisations.id)

const getOrganisation = async (
    id: number
) => getEntity(organisations, id, organisations.id)

const getOrganisationsFromUser = async (
    userId: number,
    limit: number = 100
): Promise<ActionResult<Organisation[]>> => {

    try {

        const queryOrganisations = await db
            .select({
                id: organisations.id,
                name: organisations.name,
                updatedBy: teams.updatedBy,
                updatedAt: teams.updatedAt,
                createdBy: teams.createdBy,
                createdAt: teams.createdAt
            })
            .from(organisations)
            .innerJoin(teams, eq(organisations.id, teams.organisationId))
            .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
            .limit(limit)

        if (!queryOrganisations || queryOrganisations.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryOrganisations}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export type {
    Organisation,
    NewOrganisation,
    UpdateOrganisation
}

export {
    createOrganisation,
    updateOrganisation,
    deleteOrganisation,
    getOrganisation,
    getOrganisationsFromUser
}