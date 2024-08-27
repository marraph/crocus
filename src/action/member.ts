import {createEntity, deleteEntity, Entity, NewEntity} from "@/action/actions";
import {teamMembers} from "@/schema";

type Member = Entity<typeof teamMembers>
type NewMember = NewEntity<typeof teamMembers>

const joinTeam = async (newMember: NewMember) => createEntity(teamMembers, newMember)
const leaveTeam = async (userId: number) => deleteEntity(teamMembers, userId, teamMembers.userId)

export type {
    Member,
    NewMember
}

export {
    joinTeam,
    leaveTeam
}