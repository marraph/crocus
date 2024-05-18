import {useDelete, useGet, usePost, useUpdate} from "@/service/genericDataService";
import {Organisation} from "@/types/types";

const URL = "http://localhost:8080/api/v1/organisation"

const getOrganisation = (id: number) => useGet<Organisation>(URL, id)
const updateOrganisation = (id: number, organisation: Organisation) => useUpdate<Organisation>(URL, id, organisation)
const deleteOrganisation = (id: number) => useDelete(URL, id)
const createOrganisation = (organisation: Organisation) => usePost<Organisation>(URL, organisation)

export {
    getOrganisation,
    updateOrganisation,
    deleteOrganisation,
    createOrganisation
}