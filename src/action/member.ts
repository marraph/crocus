import {ActionResult, createEntry, deleteEntity, Entity, NewEntity} from "@/action/actions";
import {members, project, team, user} from "@/schema";
import {Team} from "@/action/team";
import {db} from "@/database/drizzle";
import {eq} from "drizzle-orm";
import {User} from "@/action/user";

type Member = Entity<typeof members>
type NewMember = NewEntity<typeof members>

const joinTeam = async (newMember: NewMember) => createEntry(members, newMember)
const leaveTeam = async (userId: number) => deleteEntity(members, userId, members.userId)

const getTeamsFromUser = async (userId: number, limit: number = 100): Promise<ActionResult<Team[]>> => {
    try {
        const teams = await db
            .select({
                id: team.id,
                name: team.name,
                organisationId: team.organisationId,
                updatedBy: team.updatedBy,
                updatedAt: team.updatedAt,
                createdBy: team.createdBy,
                createdAt: team.createdAt
            })
            .from(team)
            .innerJoin(members, eq(team.id, members.teamId))
            .where(eq(members.userId, userId))
            .limit(limit)

        if (!teams || teams.length == 0) {
            return {success: false, error: 'Cannot find any teams with this id'}
        }

        return {success: true, data: teams}
    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const getUsersFromTeam = async (teamId: number, limit: number = 100): Promise<ActionResult<User[]>> => {
    try {
        const users = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            })
            .from(user)
            .innerJoin(members, eq(user.id, members.userId))
            .where(eq(members.teamId, teamId))
            .limit(limit)

        if (!users || users.length == 0) {
            return {success: false, error: 'Cannot find any teams with this id'}
        }

        return {success: true, data: users}
    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export type {
    Member,
    NewMember
}

export {
    joinTeam,
    leaveTeam,
    getUsersFromTeam,
    getTeamsFromUser
}