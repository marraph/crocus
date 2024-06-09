type Priority = "LOW" | "MEDIUM" | "HIGH"
type Status = "PENDING" | "PLANING" | "STARTED" | "TESTED" | "FINISHED" | "ARCHIVED"

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
    description: string | null
    topic: Topic | null
    isArchived: boolean
    duration: Date | null
    deadline: Date | null
    status: Status | null
    priority: Priority | null
    createdBy: PreviewUser
    createdDate: Date
    lastModifiedBy: PreviewUser
    lastModifiedDate: Date
}

type TaskElement = {
    id: number
    name: string
    description: string | null
    topic: Topic | null
    isArchived: boolean
    duration: Date | null
    deadline: Date | null
    status: Status | null
    priority: Priority | null
    createdBy: PreviewUser
    createdDate: Date
    lastModifiedBy: PreviewUser
    lastModifiedDate: Date
    team: Team | null
    project: Project | null
}


type Acceptable = User | Organisation | Team | Project | Topic | Task

export type {
    PreviewUser,
    Priority,
    Status,
    User,
    Organisation,
    Team,
    Project,
    Topic,
    Task,
    TaskElement,
    Acceptable
}