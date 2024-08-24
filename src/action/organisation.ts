import {members, organisation, team} from "@/schema";
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

type Organisation = Entity<typeof organisation>
type NewOrganisation = NewEntity<typeof organisation>
type UpdateOrganisation = UpdateEntity<typeof organisation>

const createOrganisation = async (
    newOrganisation: NewOrganisation
) => createEntry(organisation, newOrganisation)

const updateOrganisation = async (
    id: number,
    updateOrganisation: UpdateOrganisation
) => updateEntry(organisation, updateOrganisation, id, organisation.id)

const deleteOrganisation = async (
    id: number
) => deleteEntity(organisation, id, organisation.id)

const getOrganisation = async (
    id: number
) => getEntity(organisation, id, organisation.id)


const getOrganisationsFromUser = async (
    userId: number,
    limit: number = 100
): Promise<ActionResult<Organisation[]>> => {

    try {

        const organisations = await db
            .select({
                id: organisation.id,
                name: organisation.name,
                updatedBy: team.updatedBy,
                updatedAt: team.updatedAt,
                createdBy: team.createdBy,
                createdAt: team.createdAt
            })
            .from(organisation)
            .innerJoin(team, eq(organisation.id, team.organisationId))
            .innerJoin(members, eq(team.id, members.teamId))
            .limit(limit)

        if (!organisations || organisations.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: organisations}

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