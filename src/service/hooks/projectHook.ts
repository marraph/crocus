import {useDelete, useGet, usePost, useUpdate} from "@/service/genericDataService";
import {Project} from "@/types/types";

const URL = "http://localhost:8080/api/v1/project"

const getProject = (id: number) => useGet<Project>(URL, id)
const updateProject = (id: number, project: Project) => useUpdate<Project>(URL, id, project)
const deleteProject = (id: number) => useDelete(URL, id)
const createProject = (project: Project) => usePost<Project>(URL, project)

export {
    getProject,
    updateProject,
    deleteProject,
    createProject
}