import {ActionResult, createEntity, deleteEntity, Entity, NewEntity} from "@/action/actions";
import {teamMembers, projects, teams, users} from "@/schema";
import {Team} from "@/action/team";
import {db} from "@/database/drizzle";
import {eq} from "drizzle-orm";
import {User} from "@/action/user";

type Member = Entity<typeof teamMembers>
type NewMember = NewEntity<typeof teamMembers>

const joinTeam = async (newMember: NewMember) => createEntity(teamMembers, newMember)
const leaveTeam = async (userId: number) => deleteEntity(teamMembers, userId, teamMembers.userId)

const getTeamsFromUser = async (userId: number, limit: number = 100): Promise<ActionResult<Team[]>> => {
    try {
        const teams = await db
            .select({
                id: teams.id,
                name: teams.name,
                organisationId: teams.organisationId,
                updatedBy: teams.updatedBy,
                updatedAt: teams.updatedAt,
                createdBy: teams.createdBy,
                createdAt: teams.createdAt
            })
            .from(teams)
            .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
            .where(eq(teamMembers.userId, userId))
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
                id: users.id,
                name: users.name,
                email: users.email,
                password: users.password,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt
            })
            .from(users)
            .innerJoin(teamMembers, eq(users.id, teamMembers.userId))
            .where(eq(teamMembers.teamId, teamId))
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