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
        const rawTeams = await db
            .select({
                id: team.id,
                name: team.name,
                organisationId: team.organisationId
            })
            .from(members)
            .fullJoin(team, eq(members.teamId, team.id))
            .where(eq(members.userId, userId))
            .limit(limit)

        if (!rawTeams || rawTeams.length == 0) {
            return {success: false, error: 'Cannot find any teams with this id'}
        }

        const teams: Team[] = rawTeams
            .filter((t): t is Team => !t.id && !t.name && !t.organisationId);

        return {success: true, data: teams}
    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const getUsersFromTeam = async (teamId: number, limit: number = 100): Promise<ActionResult<User[]>> => {
    try {
        const rawUsers = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            })
            .from(members)
            .fullJoin(user, eq(members.userId, user.id))
            .where(eq(members.teamId, teamId))
            .limit(limit)

        if (!rawUsers || rawUsers.length == 0) {
            return {success: false, error: 'Cannot find any teams with this id'}
        }

        const users: User[] = rawUsers
            .filter((u): u is User => !u.id && !u.name && !u.email && !u.password && !u.createdAt && !u.updatedAt);

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