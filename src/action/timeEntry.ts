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
import {entries, teamMembers, organisations, projects, tasks, teams, users} from "@/schema";
import {db} from "@/database/drizzle";
import {eq} from "drizzle-orm";

type TimeEntry = Entity<typeof entries>
type NewTimeEntry = NewEntity<typeof entries>
type UpdateTimeEntry = UpdateEntity<typeof entries>

const createTimeEntry = async (
    newTimeEntry: NewTimeEntry
) => createEntry(entries, newTimeEntry)

const updateTimeEntry = async (
    id: number,
    updateTimeEntry: UpdateTimeEntry
) => updateEntry(entries, updateTimeEntry, id, entries.id)

const deleteTimeEntry = async (
    id: number
) => deleteEntity(entries, id, entries.id)

const getTimeEntry = async (
    id: number
) => getEntity(entries, id, entries.id)

const getTimeEntriesFromUser = async (
    userId: number,
    limit: number = 100
): Promise<ActionResult<TimeEntry[]>> => {

    try {

        const timeEntries = await db
            .select({
                id: entries.id,
                comment: entries.comment,
                start: entries.start,
                end: entries.end,
                createdAt: entries.createdAt,
                updatedAt: entries.updatedAt,
                createdBy: entries.createdBy,
                updatedBy: entries.updatedBy,
                projectId: entries.projectId,
                taskId: entries.taskId
            })
            .from(entries)
            .innerJoin(projects, eq(entries.projectId, projects.id))
            .innerJoin(teams, eq(projects.teamId, teams.id))
            .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
            .where(eq(teamMembers.userId, userId))
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
                id: entries.id,
                comment: entries.comment,
                start: entries.start,
                end: entries.end,
                createdAt: entries.createdAt,
                updatedAt: entries.updatedAt,
                createdBy: entries.createdBy,
                updatedBy: entries.updatedBy,
                projectId: entries.projectId,
                taskId: entries.taskId
            })
            .from(entries)
            .innerJoin(projects, eq(entries.projectId, projects.id))
            .innerJoin(teams, eq(projects.teamId, teams.id))
            .innerJoin(organisations, eq(teams.organisationId, organisations.id))
            .where(eq(organisations.id, organisationId))
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
                id: entries.id,
                comment: entries.comment,
                start: entries.start,
                end: entries.end,
                createdAt: entries.createdAt,
                updatedAt: entries.updatedAt,
                createdBy: entries.createdBy,
                updatedBy: entries.updatedBy,
                projectId: entries.projectId,
                taskId: entries.taskId
            })
            .from(entries)
            .innerJoin(projects, eq(entries.projectId, projects.id))
            .innerJoin(teams, eq(projects.teamId, teams.id))
            .where(eq(teams.id, teamId))
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
                id: entries.id,
                comment: entries.comment,
                start: entries.start,
                end: entries.end,
                createdAt: entries.createdAt,
                updatedAt: entries.updatedAt,
                createdBy: entries.createdBy,
                updatedBy: entries.updatedBy,
                projectId: entries.projectId,
                taskId: entries.taskId
            })
            .from(entries)
            .innerJoin(projects, eq(entries.projectId, projects.id))
            .where(eq(projects.id, projectId))
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
                id: entries.id,
                comment: entries.comment,
                start: entries.start,
                end: entries.end,
                createdAt: entries.createdAt,
                updatedAt: entries.updatedAt,
                createdBy: entries.createdBy,
                updatedBy: entries.updatedBy,
                projectId: entries.projectId,
                taskId: entries.taskId
            })
            .from(entries)
            .innerJoin(tasks, eq(entries.taskId, tasks.id))
            .where(eq(tasks.id, taskId))
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