'use server'

import {teamMembers, teams} from "@/schema";
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
import type {DBQueryConfig} from "drizzle-orm/relations";
import {db} from "@/database/drizzle";
import {NewTeam, Team, UpdateTeam} from "@/types/types";

const getTeam = async (id: number) => getEntity(teams, id, teams.id)

const createTeam = async (newTeam: NewTeam) => createEntity(teams, newTeam)

const deleteTeam = async (id: number) => {
    await deleteEntity(teamMembers, id, teamMembers.teamId)
    return await deleteEntity(teams, id, teams.id)
}

const updateTeam = async (
    id: number,
    updateTeam: UpdateTeam
) => updateEntity(teams, updateTeam, id, teams.id)

const queryTeam = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<Team>> => {
    try {

        const queryTeam = await db.query.teams.findFirst(config)

        if (!queryTeam) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryTeam}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const queryTeams = async (
    config: DBQueryConfig = {},
): Promise<ActionResult<Team[]>> => {
    try {

        const queryTeams = await db.query.teams.findMany(config)

        if (!queryTeams || queryTeams.length == 0) {
            return {success: false, error: 'Can not select organisations with this ID'}
        }

        return {success: true, data: queryTeams}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export {
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    queryTeam,
    queryTeams
}