type Priority = "LOW" | "MEDIUM" | "HIGH"
type Status = "Pending" | "Planing" | "Started" | "Tested" | "Finished" | "Archived"

type User = {
    id: number
    name: string
    password: string
    email: string
}

type Organisation = {
    id: number
    name: string
    createdBy: User
    createdDate: Date
    lastModifiedBy: User
    lastModifiedDate: Date
}

type Team = {
    id: number
    name: string
    organisation: Organisation
    createdBy: User
    createdDate: Date
    lastModifiedBy: User
    lastModifiedDate: Date
}

type Project = {
    id: number
    name: string
    description: string
    team: Team
    priority: Priority
    isArchived: boolean
    createdBy: User
    createdDate: Date
    lastModifiedBy: User
    lastModifiedDate: Date
}

type Topic = {
    id: number
    title: string
    hexCode: string
    createdBy: User
    createdDate: Date
    lastModifiedBy: User
    lastModifiedDate: Date
}

type Task = {
    id: number
    name: string
    description: string
    project: Project
    topic: Topic
    isArchived: boolean
    duration: Date
    deadline: Date
    status: Status
    priory: Priority
    createdBy: User
    createdDate: Date
    lastModifiedBy: User
    lastModifiedDate: Date
}

type Acceptable = User | Organisation | Team | Project | Topic | Task

export type {
    Priority,
    Status,
    User,
    Organisation,
    Team,
    Project,
    Topic,
    Task,
    Acceptable
}