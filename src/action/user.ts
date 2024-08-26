import {users} from "@/schema";
import {createEntry, deleteEntity, Entity, getEntity, NewEntity, UpdateEntity, updateEntry} from "@/action/actions";
import {leaveTeam} from "@/action/member";

type User = Entity<typeof users>
type NewUser = NewEntity<typeof users>
type UpdateUser = UpdateEntity<typeof users>

const createUser = async (newUser: NewUser) => createEntry(users, newUser)
const getUser = async (id: number) => getEntity(users, id, users.id)

const deleteUser = async (id: number) => {
    await leaveTeam(id)
    return await deleteEntity(users, id, users.id)
}

const updateUser = async (
    id: number, 
    updateUser: UpdateUser
) => updateEntry(users, updateUser, id, users.id)

export type {
    User,
    NewUser,
    UpdateUser
}

export {
    createUser,
    deleteUser,
    getUser,
    updateUser
}