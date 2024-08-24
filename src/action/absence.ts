import {
    ActionResult,
    createEntry,
    deleteEntity,
    Entity,
    getEntity,
    NewEntity,
    UpdateEntity,
    updateEntry
} from "@/action/actions";
import {absence, absenceReason, entry, members, organisation, task, team, user} from "@/schema";
import {db} from "@/database/drizzle";
import {eq} from "drizzle-orm";

type Absence = Entity<typeof absence>
type NewAbsence = NewEntity<typeof absence>
type UpdateAbsence = UpdateEntity<typeof absence>

const createAbsence = async (
    newAbsence: NewAbsence
) => createEntry(absence, newAbsence)

const updateAbsence = async (
    id: number,
    updateAbsence: UpdateAbsence
) => updateEntry(absence, updateAbsence, id, absence.id)

const deleteAbsence = async (
    id: number
) => deleteEntity(absence, id, absence.id)

const getAbsence = async (
    id: number
) => getEntity(absence, id, absence.id)

const getAbsencesFromUser = async (
    userId: number,
    limit: number = 100
): Promise<ActionResult<Absence[]>> => {

    try {

        const absences = await db
            .select({
                id: absence.id,
                comment: absence.comment,
                reason: absence.reason,
                start: absence.start,
                end: absence.end,
                createdAt: absence.createdAt,
                updatedAt: absence.updatedAt,
                createdBy: absence.createdBy,
                updatedBy: absence.updatedBy
            })
            .from(entry)
            .where(eq(entry.createdBy, userId))
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
                id: absence.id,
                comment: absence.comment,
                reason: absence.reason,
                start: absence.start,
                end: absence.end,
                createdAt: absence.createdAt,
                updatedAt: absence.updatedAt,
                createdBy: absence.createdBy,
                updatedBy: absence.updatedBy
            })
            .from(entry)
            .innerJoin(members, eq(entry.createdBy, members.userId))
            .innerJoin(team, eq(members.teamId, team.id))
            .where(eq(team.id, teamId))
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
                id: absence.id,
                comment: absence.comment,
                reason: absence.reason,
                start: absence.start,
                end: absence.end,
                createdAt: absence.createdAt,
                updatedAt: absence.updatedAt,
                createdBy: absence.createdBy,
                updatedBy: absence.updatedBy
            })
            .from(entry)
            .innerJoin(members, eq(entry.createdBy, members.userId))
            .innerJoin(team, eq(members.teamId, team.id))
            .innerJoin(organisation, eq(team.organisationId, organisation.id))
            .where(eq(organisation.id, organisationId))
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