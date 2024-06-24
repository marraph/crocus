type Priority = "LOW" | "MEDIUM" | "HIGH"
type Status = "PENDING" | "PLANING" | "STARTED" | "TESTED" | "FINISHED"
type AbsenceType = "VACATION" | "SICK"

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
    duration: number | null
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
    duration: number | null
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

type TimeEntry = {
    id: number,
    task: Task | null,
    project: Project | null,
    comment: string | null,
    startDate: Date,
    endDate: Date,
    dailyEntry: DailyEntry,
    createdBy: PreviewUser
    createdDate: Date
    lastModifiedBy: PreviewUser
    lastModifiedDate: Date
}

type DailyEntry = {
    id: number,
    startDate: Date,
    endDate: Date,
    createdBy: PreviewUser
    createdDate: Date
    lastModifiedBy: PreviewUser
    lastModifiedDate: Date
}

type Absence = {
    id: number,
    absenceType: AbsenceType,
    startDate: Date,
    endDate: Date,
    comment: string | null,
    createdBy: PreviewUser
    createdDate: Date
    lastModifiedBy: PreviewUser
    lastModifiedDate: Date

}

type Acceptable = User | Organisation | Team | Project | Topic | Task  | TimeEntry | DailyEntry | Absence

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
    TimeEntry,
    DailyEntry,
    Absence,
    Acceptable
}