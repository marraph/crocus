import {useDelete, useGet, usePost, useUpdate} from "@/service/genericDataService";
import {User} from "@/types/types";

const URL = "http://localhost:8080/api/v1/user"

const getUser = (id: number) => useGet<User>(URL, id)
const updateUser = (id: number, user: User) => useUpdate<User>(URL, id, user)
const deleteUser = (id: number) => useDelete(URL, id)
const createUser = (user: User) => usePost<User>(URL, user)

export {
    getUser,
    updateUser,
    deleteUser,
    createUser
}