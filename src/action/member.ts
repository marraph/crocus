'use server'

import {createEntity, deleteEntity, Entity, NewEntity} from "@/action/actions";
import {teamMembers} from "@/schema";
import {NewMember} from "@/types/types";

const joinTeam = async (newMember: NewMember) => createEntity(teamMembers, newMember)
const leaveTeam = async (userId: number) => deleteEntity(teamMembers, userId, teamMembers.userId)

export {
    joinTeam,
    leaveTeam
}