import {user} from "@/schema";
import {createEntry, deleteEntity, Entity, getEntity, NewEntity, UpdateEntity, updateEntry} from "@/action/actions";
import {leaveTeam} from "@/action/member";

type User = Entity<typeof user>
type NewUser = NewEntity<typeof user>
type UpdateUser = UpdateEntity<typeof user>

const createUser = async (newUser: NewUser) => createEntry(user, newUser)
const getUser = async (id: number) => getEntity(user, id, user.id)

const deleteUser = async (id: number) => {
    await leaveTeam(id)
    return await deleteEntity(user, id, user.id)
}

const updateUser = async (
    id: number, 
    updateUser: UpdateUser
) => updateEntry(user, updateUser, id, user.id)

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