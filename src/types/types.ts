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
}

type Team = {
    id: number
    name: string
    organisation: Organisation
}

type Project = {
    id: number
    name: string
    description: string
    team: Team
    priority: Priority
    isArchived: boolean
}

type Topic = {
    id: number
    title: string
    hexCode: string
}

type Task = {
    id: number
    name: string
    description: string
    project: Project
    topic: Topic
    isArchived: boolean
    duration: string
    deadline: string
    status: Status
    priory: Priority
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