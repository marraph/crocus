import {
    ActionResult,
    createEntity,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    UpdateEntity,
    updateEntity
} from "@/action/actions";
import {absences, absenceReason, entries, teamMembers, organisations, tasks, teams, users} from "@/schema";
import {db} from "@/database/drizzle";
import {eq} from "drizzle-orm";

type Absence = Entity<typeof absences>
type NewAbsence = NewEntity<typeof absences>
type UpdateAbsence = UpdateEntity<typeof absences>

const createAbsence = async (
    newAbsence: NewAbsence
) => createEntity(absences, newAbsence)

const updateAbsence = async (
    id: number,
    updateAbsence: UpdateAbsence
) => updateEntity(absences, updateAbsence, id, absences.id)

const deleteAbsence = async (
    id: number
) => deleteEntity(absences, id, absences.id)

const getAbsence = async (
    id: number
) => getEntity(absences, id, absences.id)

const getAbsencesFromUser = async (
    userId: number,
    limit: number = 100
): Promise<ActionResult<Absence[]>> => {

    try {

        const absences = await db
            .select({
                id: absences.id,
                comment: absences.comment,
                reason: absences.reason,
                start: absences.start,
                end: absences.end,
                createdAt: absences.createdAt,
                updatedAt: absences.updatedAt,
                createdBy: absences.createdBy,
                updatedBy: absences.updatedBy
            })
            .from(entries)
            .where(eq(entries.createdBy, userId))
            .limit(limit)

        if (!absences || absences.length == 0) {
            return {success: false, error: 'Can not find any time entries with this id'}
        }

        return {success: true, data: absences}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const getAbsencesFromTeam = async (
    teamId: number,
    limit: number = 100
): Promise<ActionResult<Absence[]>> => {

    try {

        const absences = await db
            .select({
                id: absences.id,
                comment: absences.comment,
                reason: absences.reason,
                start: absences.start,
                end: absences.end,
                createdAt: absences.createdAt,
                updatedAt: absences.updatedAt,
                createdBy: absences.createdBy,
                updatedBy: absences.updatedBy
            })
            .from(entries)
            .innerJoin(teamMembers, eq(entries.createdBy, teamMembers.userId))
            .innerJoin(teams, eq(teamMembers.teamId, teams.id))
            .where(eq(teams.id, teamId))
            .limit(limit)

        if (!absences || absences.length == 0) {
            return {success: false, error: 'Can not find any time entries with this id'}
        }

        return {success: true, data: absences}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const getAbsencesFromOrganisation = async (
    organisationId: number,
    limit: number = 100
): Promise<ActionResult<Absence[]>> => {

    try {

        const absences = await db
            .select({
                id: absences.id,
                comment: absences.comment,
                reason: absences.reason,
                start: absences.start,
                end: absences.end,
                createdAt: absences.createdAt,
                updatedAt: absences.updatedAt,
                createdBy: absences.createdBy,
                updatedBy: absences.updatedBy
            })
            .from(entries)
            .innerJoin(teamMembers, eq(entries.createdBy, teamMembers.userId))
            .innerJoin(teams, eq(teamMembers.teamId, teams.id))
            .innerJoin(organisations, eq(teams.organisationId, organisations.id))
            .where(eq(organisations.id, organisationId))
            .limit(limit)

        if (!absences || absences.length == 0) {
            return {success: false, error: 'Can not find any time entries with this id'}
        }

        return {success: true, data: absences}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export type {
    Absence,
    NewAbsence,
    UpdateAbsence
}

export {
    createAbsence,
    updateAbsence,
    deleteAbsence,
    getAbsence,
    getAbsencesFromUser,
    getAbsencesFromOrganisation,
    getAbsencesFromTeam
}