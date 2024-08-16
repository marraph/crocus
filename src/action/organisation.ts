import {organisation} from "@/schema";
import {createEntry, deleteEntity, getEntity, NewEntity, UpdateEntity, updateEntry} from "@/action/actions";

export type NewOrganisation = NewEntity<typeof organisation>
export type UpdateOrganisation = UpdateEntity<typeof organisation>

export const createOrganisation = (newOrganisation: NewOrganisation) => createEntry(organisation, newOrganisation)
export const updateOrganisation = (id: number, updateOrganisation: UpdateOrganisation) => updateEntry(organisation, updateOrganisation, id, organisation.id)
export const deleteOrganisation = (id: number) => deleteEntity(organisation, id, organisation.id)
export const getOrganisation = (id: number) => getEntity(organisation, id, organisation.id)