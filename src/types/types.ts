import {Topic} from "@/action/topic";
import {Absence} from "@/action/absence";
import {TimeEntry} from "@/action/timeEntry";
import {Team} from "@/action/team";
import {Organisation} from "@/action/organisation";
import {Task} from "@/action/task";
import {Project} from "@/action/projects";
import {User} from "@/action/user";

type Priority = 'low' | 'medium' | 'high';
type State = 'pending' | 'planing' | 'started' | 'tested' | 'finished';
type AbsenceReason = 'sick' | 'vacation';

type ActionConsumerType = Team | Organisation | Absence | Task | Project | TimeEntry | Topic | User

type CompletedUser = {
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

type TeamMembership = {
    createdAt: Date,
    userId: number,
    teamId: number
    team: CompletedTeam
}

type OrganisationMembership = {
    createdAt: Date
    organisationId: number
    userId: number
    organisation: CompletedOrganisation
}

type CompletedOrganisation = {
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

type CompletedTeam = {
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

type CompletedProject = {
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

type CompletedTask = {
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

export type {
    ActionConsumerType,
    CompletedUser,
    Priority,
    State,
    AbsenceReason
}
