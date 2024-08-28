import {organisations} from "@/schema";
import {
    createEntity,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    UpdateEntity,
    updateEntity
} from "@/action/actions";
import {db} from "@/database/drizzle";
import type {DBQueryConfig} from "drizzle-orm/relations";

type Organisation = Entity<typeof organisations>
type NewOrganisation = NewEntity<typeof organisations>
type UpdateOrganisation = UpdateEntity<typeof organisations>

const createOrganisation = async (
    newOrganisation: NewOrganisation
) => createEntity(organisations, newOrganisation)

const updateOrganisation = async (
    id: number,
    updateOrganisation: UpdateOrganisation
) => updateEntity(organisations, updateOrganisation, id, organisations.id)

const deleteOrganisation = async (
    id: number
) => deleteEntity(organisations, id, organisations.id)

const getOrganisation = async (
    id: number
) => getEntity(organisations, id, organisations.id)

const queryOrganisation = async (
    config: DBQueryConfig = {},
) => {
    try {

        const queryOrganisation = await db.query.organisations.findFirst(config)

        if (!queryOrganisation) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryOrganisation}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const queryOrganisations = async (
    config: DBQueryConfig = {},
) => {
    try {

        const queryOrganisations = await db.query.organisations.findMany(config)

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
    queryOrganisation,
    queryOrganisations
}