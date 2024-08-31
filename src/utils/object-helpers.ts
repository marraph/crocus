import { Topic } from "@/action/topic";
import {CompletedProject, CompletedTask, CompletedTeam, CompletedUser} from "@/types/types";
import {TimeEntry} from "@/action/timeEntry";
import {Absence} from "@/action/absence";
import moment from "moment/moment";

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

export function getTaskById(user: CompletedUser, taskId: number): ComplexTask {
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