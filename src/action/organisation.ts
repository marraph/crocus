import {organisation} from "@/schema";
import {createEntry, deleteEntity, Entity, getEntity, NewEntity, UpdateEntity, updateEntry} from "@/action/actions";

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
}