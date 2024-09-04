import {Entity, NewEntity, UpdateEntity} from "@/action/actions";
import {absences, entries, organisations, projects, tasks, teamMembers, teams, topics, users} from "@/schema";

export type Priority = 'low' | 'medium' | 'high';
export type State = 'pending' | 'planing' | 'started' | 'tested' | 'finished';
export type AbsenceReason = 'sick' | 'vacation';

export type ActionConsumerType = Team | Organisation | Absence | Task | Project | TimeEntry | Topic | User | boolean

export type CompletedUser = {
    id: number
    name: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
    organisationMemberships: OrganisationMembership[]
    teamMemberships: TeamMembership[],
    absence: Absence[]
    entry: TimeEntry[]
}

export type TeamMembership = {
    createdAt: Date,
    userId: number,
    teamId: number
    team: CompletedTeam
}

export type OrganisationMembership = {
    createdAt: Date
    organisationId: number
    userId: number
    organisation: CompletedOrganisation
}

export type CompletedOrganisation = {
    id: number,
    name: string,
    createdBy: {
        id: number;
        name: string;
        password: string,
        email: string;
        createdAt: Date;
        updatedAt: Date;
    },
    updatedBy: {
        id: number;
        name: string;
        password: string,
        email: string;
        createdAt: Date;
        updatedAt: Date;
    },
    createdAt: Date,
    updatedAt: Date
}

export type CompletedTeam = {
    id: number
    name: string
    createdBy: {
        id: number;
        name: string;
        password: string,
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }
    updatedBy: {
        id: number;
        password: string,
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }
    createdAt: Date
    updatedAt: Date,
    topic: Topic[]
    project: CompletedProject[]
}

export type CompletedProject = {
    id: number
    name: string
    description: string | null
    priority: Priority | null
    isArchived: boolean | null
    createdBy: {
        id: number;
        name: string;
        email: string;
        password: string,
        createdAt: Date;
        updatedAt: Date;
    }
    updatedBy: {
        id: number;
        name: string;
        password: string,
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }
    createdAt: Date
    updatedAt: Date
    task: CompletedTask[]
}

export type CompletedTask = {
    id: number
    name: string
    description: string | null
    isArchived: boolean | null
    duration: number | null
    bookedDuration: number | null
    deadline: Date | null
    state: State | null
    priority: Priority | null
    createdBy: {
        id: number;
        password: string,
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }
    updatedBy: {
        id: number;
        password: string,
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }
    createdAt: Date
    updatedAt: Date
    topic?: Topic
}

export type Absence = Entity<typeof absences>
export type NewAbsence = NewEntity<typeof absences>
export type UpdateAbsence = UpdateEntity<typeof absences>

export type Member = Entity<typeof teamMembers>
export type NewMember = NewEntity<typeof teamMembers>

export type Organisation = Entity<typeof organisations>
export type NewOrganisation = NewEntity<typeof organisations>
export type UpdateOrganisation = UpdateEntity<typeof organisations>

export type Project = Entity<typeof projects>
export type NewProject = NewEntity<typeof projects>
export type UpdateProject = UpdateEntity<typeof projects>

export type Task = Entity<typeof tasks>
export type NewTask = NewEntity<typeof tasks>
export type UpdateTask = UpdateEntity<typeof tasks>

export type Team = Entity<typeof teams>
export type NewTeam = NewEntity<typeof teams>
export type UpdateTeam = UpdateEntity<typeof teams>

export type TimeEntry = Entity<typeof entries>
export type NewTimeEntry = NewEntity<typeof entries>
export type UpdateTimeEntry = UpdateEntity<typeof entries>

export type Topic = Entity<typeof topics>
export type NewTopic = NewEntity<typeof topics>
export type UpdateTopic = UpdateEntity<typeof topics>

export type User = Entity<typeof users>
export type NewUser = NewEntity<typeof users>
export type UpdateUser = UpdateEntity<typeof users>