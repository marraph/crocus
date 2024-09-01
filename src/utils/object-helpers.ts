import { Topic } from "@/action/topic";
import {CompletedProject, CompletedTask, CompletedTeam, CompletedUser} from "@/types/types";
import {TimeEntry} from "@/action/timeEntry";
import {Absence} from "@/action/absence";
import moment from "moment/moment";
import {Task} from "@/action/task";

export function getDashboardTasks(user: CompletedUser): CompletedTask[] {
    let taskList: CompletedTask[] = [];
    user.teamMemberships.forEach((team) => {
        team.team.project.forEach((project) => {
            project.task.forEach((task) => {
                taskList.push(task);
            });
        });
    });
    return taskList.filter((task: CompletedTask) => task.state !== "finished")
        .sort((a: CompletedTask, b: CompletedTask) => {
            const priorityOrder = {LOW: 1, MEDIUM: 2, HIGH: 3};
            const aPriority = a.priority ? priorityOrder[a.priority as keyof typeof priorityOrder] : 0;
            const bPriority = b.priority ? priorityOrder[b.priority as keyof typeof priorityOrder] : 0;
            return bPriority - aPriority;
        });
}

export function getProjectByTaskId(user: CompletedUser, taskId: number): CompletedProject {
    let project = {} as CompletedProject;
    user.teamMemberships.forEach((team) => {
        team.team.project.forEach((proj) => {
            proj.task.forEach((task) => {
                if (task.id === taskId) {
                    project = proj;
                }
            });
        });
    });
    return project;
}

export function getTeamsFromUser(user: CompletedUser): CompletedTeam[] {
    let teamList = [] as CompletedTeam[];
    user.teamMemberships.forEach((team) => {
        teamList.push(team.team);
    });
    return teamList;
}

export function getProjectsFromUser(user: CompletedUser): CompletedProject[] {
    let projectList = [] as CompletedProject[];
    user.teamMemberships.forEach((team) => {
        team.team.project.forEach((project) => {
            projectList.push(project);
        });
    });
    return projectList;
}

export function getProjectFromId(user: CompletedUser, projectId: number): CompletedProject | undefined {
    for (const membership of user.teamMemberships) {
        const project = membership.team.project.find((proj) => proj.id === projectId);
        if (project) return project;
    }
}

export function getProjectsFromTeamId(user: CompletedUser, teamId: number): CompletedProject[] {
    let projectList = [] as CompletedProject[];
    user.teamMemberships.forEach((team) => {
        if (team.team.id === teamId) {
            team.team.project.forEach((project) => {
                projectList.push(project);
            });
        }
    });
    return projectList;
}

export function getTopicsFromTeamId(user: CompletedUser, teamId: number): Topic[] {
    let topicList = [] as Topic[];
    user.teamMemberships.forEach((team) => {
        if (team.team.id === teamId) {
            team.team.project.forEach((project) => {
                project.task.forEach((task) => {
                    if (task.topic) {
                        topicList.push(task.topic);
                    }
                });
            });
        }
    });
    return topicList;
}

export function getTopicsFromUser(user: CompletedUser): Topic[] {
    let topicList = [] as Topic[];
    user.teamMemberships.forEach((team) => {
        team.team.project.forEach((project) => {
            project.task.forEach((task) => {
                if (task.topic) {
                    topicList.push(task.topic);
                }
            });
        });
    });
    return topicList;
}

export function getTasksFromProjectId(user: CompletedUser, projectId: number): ComplexTask[] {
    let taskList = [] as ComplexTask[];
    user.teamMemberships.forEach((team) => {
        team.team.project.forEach((project) => {
            if (project.id === projectId) {
                project.task.forEach((task) => {
                    taskList.push({
                        task: task,
                        project: project,
                        team: team.team
                    });
                });
            }
        });
    });
    return taskList;
}

export type ComplexTask = {
    team: CompletedTeam,
    project: CompletedProject,
    task: CompletedTask
}

export function getTasksFromUser(user: CompletedUser): ComplexTask[] {
    let taskList = [] as ComplexTask[];
    user.teamMemberships.forEach((team) => {
        team.team.project.forEach((project) => {
            project.task.forEach((task) => {
                taskList.push({
                    task: task,
                    project: project,
                    team: team.team
                });
            });
        });
    });
    return taskList;
}

export function getTaskFromId(user: CompletedUser, taskId: number): ComplexTask {
    let task = {} as ComplexTask;
    user.teamMemberships.forEach((team) => {
        team.team.project.forEach((project) => {
            project.task.forEach((t) => {
                if (t.id === taskId) {
                    task = {
                        team: team.team,
                        project: project,
                        task: t
                    };
                }
            });
        });
    });
    return task;
}



//Update CompletedUser
export function createTaskInCompletedUser(user: CompletedUser, task: Task): CompletedUser {
    let updatedUser = {...user};
    updatedUser.teamMemberships.forEach((team) => {
        team.team.project.forEach((project) => {
            if (project.id === task.projectId) {
                project.task.push({
                    id: task.id,
                    name: task.name,
                    description: task.description,
                    state: task.state,
                    priority: task.priority,
                    topic: { } as Topic,
                    duration: task.duration,
                    bookedDuration: task.bookedDuration,
                    deadline: task.deadline,
                    isArchived: task.isArchived,
                    createdBy: { } as CompletedUser,
                    createdAt: task.createdAt,
                    updatedBy: { } as CompletedUser,
                    updatedAt: task.updatedAt
                });
            }
        });
    });
    return updatedUser;
}

export function updateTaskInCompletedUser(user: CompletedUser, taskId: number): CompletedUser {
    let updatedUser = {...user};
    updatedUser.teamMemberships.forEach((team) => {
        team.team.project.forEach((project) => {
            project.task.forEach((t) => {
                if (t.id === taskId) {
                    const task: Task = {
                        id: t.id,
                        name: t.name,
                        description: t.description,
                        state: t.state,
                        priority: t.priority,
                        topic: t.topic?.id ?? null,
                        duration: t.duration,
                        bookedDuration: t.bookedDuration,
                        deadline: t.deadline,
                        isArchived: t.isArchived,
                        createdBy: t.createdBy.id,
                        createdAt: t.createdAt,
                        updatedBy: t.updatedBy.id,
                        updatedAt: t.updatedAt,
                        projectId: project.id
                    }
                }
            });
        });
    });
    return updatedUser;
}

export function deleteTaskInCompletedUser(user: CompletedUser, taskId: number): CompletedUser {
    let updatedUser = {...user};
    updatedUser.teamMemberships.forEach((team) => {
        team.team.project.forEach((project) => {
            project.task = project.task.filter((task) => task.id !== taskId);
        });
    });
    return updatedUser;
}

export function createAbsenceInCompletedUser(user: CompletedUser, absence: Absence): CompletedUser {
    let updatedUser = {...user};
    updatedUser.absence.push(absence);
    return updatedUser;
}

export function deleteTimeEntryInCompletedUser(user: CompletedUser, timeEntryId: number): CompletedUser {
    let updatedUser = {...user};
    updatedUser.entry = updatedUser.entry.filter((entry) => entry.id !== timeEntryId);
    return updatedUser;
}

export function deleteAbsenceInCompletedUser(user: CompletedUser, absenceId: number): CompletedUser {
    let updatedUser = {...user};
    updatedUser.absence = updatedUser.absence.filter((absence) => absence.id !== absenceId);
    return updatedUser;
}

export function updateAbsenceInCompletedUser(user: CompletedUser, absenceId: number, absence: Absence): CompletedUser {
    let updatedUser = {...user};
    updatedUser.absence.forEach((abs) => {
        if (abs.id === absenceId) {
            abs.start = absence.start;
            abs.end = absence.end;
            abs.comment = absence.comment;
            abs.reason = absence.reason;
            abs.updatedAt = new Date();
        }
    });
    return updatedUser;
}

export function updateTimeEntryInCompletedUser(user: CompletedUser, timeEntryId: number, timeEntry: TimeEntry): CompletedUser {
    let updatedUser = {...user};
    updatedUser.entry.forEach((entry) => {
        if (entry.id === timeEntryId) {
            entry.start = timeEntry.start;
            entry.end = timeEntry.end;
            entry.comment = timeEntry.comment;
            entry.updatedAt = new Date();
        }
    });
    return updatedUser;
}


//TimeTracking
export function getTodayEntriesFromUser(user: CompletedUser): TimeEntry[] {
    let entries = [] as TimeEntry[];
    let day = new Date();
    user.entry.forEach((entry) => {
        if (entry.start) {
            if (moment(entry.start).isSame(day, 'day')) {
                entries.push(entry);
            }
        }
    });
    return entries;
}

export function getTodayAbsencesFromUser(user: CompletedUser): Absence[] {
    let absences = [] as Absence[];
    let day = new Date();
    user.absence.forEach((absence) => {
        if (absence.start && absence.end) {
            if (moment(day).isBetween(absence.start, absence.end, 'day')) {
                absences.push(absence);
            }
        }
    });
    return absences;
}