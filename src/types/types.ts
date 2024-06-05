type Priority = "LOW" | "MEDIUM" | "HIGH"
type Status = "Pending" | "Planing" | "Started" | "Tested" | "Finished" | "Archived"

type PreviewUser = {
    id: number
    name: string
    email: string
}

type User = {
    id: number
    name: string
    password: string
    email: string
    teams: Team[]
}

type Organisation = {
    id: number
    name: string
    createdBy: PreviewUser
    createdDate: Date
    lastModifiedBy: PreviewUser
    lastModifiedDate: Date
}

type Team = {
    id: number
    name: string
    organisation: Organisation
    projects: Project[]
    createdBy: PreviewUser
    createdDate: Date
    lastModifiedBy: User
    lastModifiedDate: PreviewUser
}

type Project = {
    id: number
    name: string
    description: string
    priority: Priority
    isArchived: boolean
    tasks: Task[]
    createdBy: PreviewUser
    createdDate: Date
    lastModifiedBy: PreviewUser
    lastModifiedDate: Date
}

type Topic = {
    id: number
    title: string
    hexCode: string
    createdBy: PreviewUser
    createdDate: Date
    lastModifiedBy: PreviewUser
    lastModifiedDate: Date
}

type Task = {
    id: number
    name: string
    description: string
    topic: Topic
    isArchived: boolean
    duration: Date
    deadline: Date
    status: Status
    priority: Priority
    createdBy: PreviewUser
    createdDate: Date
    lastModifiedBy: PreviewUser
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