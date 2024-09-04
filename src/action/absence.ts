'use server'

import {
    ActionResult,
    createEntity,
    deleteEntity,
    getEntity,
    updateEntity
} from "@/action/actions";
import {absences} from "@/schema";
import {db} from "@/database/drizzle";
import type {DBQueryConfig} from "drizzle-orm/relations";
import {Absence, NewAbsence, UpdateAbsence} from "@/types/types";

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

const queryAbsence = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<Absence>> => {
    try {

        const result = await db.query.absences.findFirst(config)

        if (!result) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: result}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const queryAbsences = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<Absence[]>> => {
    try {

        const result = await db.query.absences.findMany(config)

        if (!result || result.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: result}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export {
    createAbsence,
    updateAbsence,
    deleteAbsence,
    getAbsence,
    queryAbsence,
    queryAbsences
}