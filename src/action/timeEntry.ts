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
import {entry, members, organisation, project, task, team, user} from "@/schema";
import {db} from "@/database/drizzle";
import {eq} from "drizzle-orm";

type TimeEntry = Entity<typeof entry>
type NewTimeEntry = NewEntity<typeof entry>
type UpdateTimeEntry = UpdateEntity<typeof entry>

const createTimeEntry = async (
    newTimeEntry: NewTimeEntry
) => createEntry(entry, newTimeEntry)

const updateTimeEntry = async (
    id: number,
    updateTimeEntry: UpdateTimeEntry
) => updateEntry(entry, updateTimeEntry, id, entry.id)

const deleteTimeEntry = async (
    id: number
) => deleteEntity(entry, id, entry.id)

const getTimeEntry = async (
    id: number
) => getEntity(entry, id, entry.id)

const getTimeEntriesFromUser = async (
    userId: number,
    limit: number = 100
): Promise<ActionResult<TimeEntry[]>> => {

    try {

        const timeEntries = await db
            .select({
                id: entry.id,
                comment: entry.comment,
                start: entry.start,
                end: entry.end,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
                createdBy: entry.createdBy,
                updatedBy: entry.updatedBy,
                projectId: entry.projectId,
                taskId: entry.taskId
            })
            .from(entry)
            .innerJoin(project, eq(entry.projectId, project.id))
            .innerJoin(team, eq(project.teamId, team.id))
            .innerJoin(members, eq(team.id, members.teamId))
            .where(eq(members.userId, userId))
            .limit(limit)

        if (!timeEntries || timeEntries.length == 0) {
            return {success: false, error: 'Can not find any time entries with this id'}
        }

        return {success: true, data: timeEntries}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const getTimeEntriesFromOrganisation = async (
    organisationId: number,
    limit: number = 100
): Promise<ActionResult<TimeEntry[]>> => {

    try {

        const timeEntries = await db
            .select({
                id: entry.id,
                comment: entry.comment,
                start: entry.start,
                end: entry.end,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
                createdBy: entry.createdBy,
                updatedBy: entry.updatedBy,
                projectId: entry.projectId,
                taskId: entry.taskId
            })
            .from(entry)
            .innerJoin(project, eq(entry.projectId, project.id))
            .innerJoin(team, eq(project.teamId, team.id))
            .innerJoin(organisation, eq(team.organisationId, organisation.id))
            .where(eq(organisation.id, organisationId))
            .limit(limit)

        if (!timeEntries || timeEntries.length == 0) {
            return {success: false, error: 'Can not find any time entries with this id'}
        }

        return {success: true, data: timeEntries}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const getTimeEntriesFromTeam = async (
    teamId: number,
    limit: number = 100
): Promise<ActionResult<TimeEntry[]>> => {

    try {

        const timeEntries = await db
            .select({
                id: entry.id,
                comment: entry.comment,
                start: entry.start,
                end: entry.end,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
                createdBy: entry.createdBy,
                updatedBy: entry.updatedBy,
                projectId: entry.projectId,
                taskId: entry.taskId
            })
            .from(entry)
            .innerJoin(project, eq(entry.projectId, project.id))
            .innerJoin(team, eq(project.teamId, team.id))
            .where(eq(team.id, teamId))
            .limit(limit)

        if (!timeEntries || timeEntries.length == 0) {
            return {success: false, error: 'Can not find any time entries with this id'}
        }

        return {success: true, data: timeEntries}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}


const getTimeEntriesFromProject = async (
    projectId: number,
    limit: number = 100
): Promise<ActionResult<TimeEntry[]>> => {

    try {

        const timeEntries = await db
            .select({
                id: entry.id,
                comment: entry.comment,
                start: entry.start,
                end: entry.end,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
                createdBy: entry.createdBy,
                updatedBy: entry.updatedBy,
                projectId: entry.projectId,
                taskId: entry.taskId
            })
            .from(entry)
            .innerJoin(project, eq(entry.projectId, project.id))
            .where(eq(project.id, projectId))
            .limit(limit)

        if (!timeEntries || timeEntries.length == 0) {
            return {success: false, error: 'Can not find any time entries with this id'}
        }

        return {success: true, data: timeEntries}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const getTimeEntriesFromTask = async (
    taskId: number,
    limit: number = 100
): Promise<ActionResult<TimeEntry[]>> => {

    try {

        const timeEntries = await db
            .select({
                id: entry.id,
                comment: entry.comment,
                start: entry.start,
                end: entry.end,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
                createdBy: entry.createdBy,
                updatedBy: entry.updatedBy,
                projectId: entry.projectId,
                taskId: entry.taskId
            })
            .from(entry)
            .innerJoin(task, eq(entry.taskId, task.id))
            .where(eq(task.id, taskId))
            .limit(limit)

        if (!timeEntries || timeEntries.length == 0) {
            return {success: false, error: 'Can not find any time entries with this id'}
        }

        return {success: true, data: timeEntries}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export type {
    TimeEntry,
    NewTimeEntry,
    UpdateTimeEntry
}

export {
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    getTimeEntry,
    getTimeEntriesFromUser,
    getTimeEntriesFromOrganisation,
    getTimeEntriesFromTeam,
    getTimeEntriesFromProject,
    getTimeEntriesFromTask
}