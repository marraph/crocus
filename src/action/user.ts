import {users} from "@/schema";
import {
    createEntity,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    UpdateEntity,
    updateEntity
} from "@/action/actions";
import {leaveTeam} from "@/action/member";
import type {DBQueryConfig} from "drizzle-orm/relations";
import {db} from "@/database/drizzle";

type User = Entity<typeof users>
type NewUser = NewEntity<typeof users>
type UpdateUser = UpdateEntity<typeof users>

const createUser = async (newUser: NewUser) => createEntity(users, newUser)
const getUser = async (id: number) => getEntity(users, id, users.id)

const deleteUser = async (id: number) => {
    await leaveTeam(id)
    return await deleteEntity(users, id, users.id)
}

const updateUser = async (
    id: number, 
    updateUser: UpdateUser
) => updateEntity(users, updateUser, id, users.id)

const queryUser = async (
    config: DBQueryConfig = {},
) => {
    try {

        const queryUser = await db.query.users.findFirst(config)

        if (!queryUser) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryUser}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const queryUsers = async (
    config: DBQueryConfig = {},
) => {
    try {

        const queryUsers = await db.query.users.findMany(config)

        if (!queryUsers || queryUsers.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryUsers}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export type {
    User,
    NewUser,
    UpdateUser
}

export {
    createUser,
    deleteUser,
    getUser,
    updateUser,
    queryUser,
    queryUsers
}