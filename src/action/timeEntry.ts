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
import {entries, teamMembers, organisations, projects, tasks, teams, users} from "@/schema";
import {db} from "@/database/drizzle";
import {eq} from "drizzle-orm";
import type {DBQueryConfig} from "drizzle-orm/relations";
import {Absence} from "@/action/absence";

type TimeEntry = Entity<typeof entries>
type NewTimeEntry = NewEntity<typeof entries>
type UpdateTimeEntry = UpdateEntity<typeof entries>

const createTimeEntry = async (
    newTimeEntry: NewTimeEntry
) => createEntity(entries, newTimeEntry)

const updateTimeEntry = async (
    id: number,
    updateTimeEntry: UpdateTimeEntry
) => updateEntity(entries, updateTimeEntry, id, entries.id)

const deleteTimeEntry = async (
    id: number
) => deleteEntity(entries, id, entries.id)

const getTimeEntry = async (
    id: number
) => getEntity(entries, id, entries.id)

const queryTimeEntry = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<TimeEntry>> => {
    try {

        const result = await db.query.entries.findFirst(config)

        if (!result) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: result}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const queryTimeEntries = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<TimeEntry[]>> => {
    try {

        const result = await db.query.entries.findMany(config)

        if (!result || result.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: result}

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
    queryTimeEntries,
    queryTimeEntry
}