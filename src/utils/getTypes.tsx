import {Project, Task, Team, Topic, User} from "@/types/types";

export function getTeams(user: User): string[] {
    const teams: string[] = [];
    user.teams.forEach((team: Team) => {
        teams.push(team.name);
    });
    return teams;
}

export function getProjects(user: User, teamToFind: string): string[] {
    const specificTeam = user.teams.find((team: Team) => team.name === teamToFind);
    const projects: string[] = [];
    specificTeam?.projects.forEach((project: Project) => {
        projects.push(project.name);
    });
    return projects;
}

export function getAllProjects(user: User): string[] {
    const projects: string[] = [];
    user?.teams.forEach((team: Team) => {
        team.projects.forEach((project: Project) => {
            projects.push(project.name);
        });
    });
    return projects;
}

export function getProject(user: User, projectName: string | null | undefined): Project | null {
    user.teams.forEach((team: Team) => {
        team.projects.forEach((project: Project) => {
            if (project.name === projectName)
                return project;
        })
    });
    return null;
}

export function getProjectFromTask(user: User, task: string): string {
    let project: string = "";
    user.teams.forEach((team: Team) => {
        team.projects.forEach((proj: Project) => {
            proj.tasks.forEach((tsk: Task) => {
                if (tsk.name === task) {
                    project = proj.name;
                }
            });
        });
    });
    return project;
}

export function getTopics(user: User): string[] {
    const topics: string[] = [];
    user.teams.forEach(team => {
        team.projects.forEach(project => {
            project.tasks.forEach(task => {
                if (task.topic && !topics.includes(task.topic.title)) {
                    topics.push(task.topic.title);
                }
            });
        });
    });
    return topics;
}

export function getTopicItem(user: User, topic: string): Topic | undefined {
    for (const team of user.teams ?? []) {
        for (const project of team.projects) {
            for (const task of project.tasks) {
                if (task.topic?.title === topic) {
                    return task.topic;
                }
            }
        }
    }
    return undefined;
}

export function getAllTasks(user: User): string[] {
    const tasks: string[] = [];
    user?.teams.forEach((team: Team) => {
        team.projects.forEach((project: Project) => {
            project.tasks.forEach((task: Task) => {
                tasks.push(task.name);
            });
        });
    });
    return tasks;
}

export function getTasksFromProject(user: User, projectToFind: string): string[] {
    const tasks: string[] = [];
    user?.teams.forEach((team: Team) => {
        team.projects.forEach((project: Project) => {
            if (project.name === projectToFind) {
                project.tasks.forEach((task: Task) => {
                    tasks.push(task.name);
                });
            }
        });
    });
    return tasks;
}