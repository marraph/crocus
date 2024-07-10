import {Priority, Project, Status, Task, TaskElement, Team, Topic, User} from "@/types/types";

export function getAllTeams(user: User): string[] {
    const teams: string[] = [];
    user.teams.forEach((team: Team) => {
        teams.push(team.name);
    });
    return teams;
}

export function getAllCreators(user: User): string[] {
    const creators: string[] = [];
    user.teams.forEach(team => {
        team.projects.forEach(project => {
            project.tasks.forEach(task => {
                if (!creators.includes(task.createdBy.name))
                    creators.push(task.createdBy.name);
            });
        });
    });
    return creators;

}

export function getProjects(user: User, teamToFind: string): string[] {
    const specificTeam = user.teams.find((team: Team) => team.name === teamToFind);
    const projects: string[] = [];
    specificTeam?.projects.forEach((project: Project) => {
        projects.push(project.name);
    });
    return projects;
}

export function getAllProjectsString(user: User): string[] {
    const projects: string[] = [];
    user?.teams.forEach((team: Team) => {
        team.projects.forEach((project: Project) => {
            projects.push(project.name);
        });
    });
    return projects;
}

export function getAllProjects(user: User): Project[] {
    const projects: Project[] = [];
    user?.teams.forEach((team: Team) => {
        team.projects.forEach((project: Project) => {
            projects.push(project);
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

export function getProjectFromTaskString(user: User, task: string): string {
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

export function getProjectFromTask(user: User, task: Task | null): Project | null {
    if (!task) return null;
    let project: Project | null = null;
    user.teams.forEach((team: Team) => {
        team.projects.forEach((proj: Project) => {
            proj.tasks.forEach((tsk: Task) => {
                if (tsk.name === task.name) {
                    project = proj;
                }
            });
        });
    });
    return project;
}

export function getAllTopics(user: User): string[] {
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

export function getAllTasksString(user: User): string[] {
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

export function getAllTasks(user: User): Task[] {
    const tasks: Task[] = [];
    user?.teams.forEach((team: Team) => {
        team.projects.forEach((project: Project) => {
            project.tasks.forEach((task: Task) => {
                tasks.push(task);
            });
        });
    });
    return tasks;
}

export function getTasksFromProjectString(user: User, projectToFind: string): string[] {
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

export function getTasksFromProject(user: User, projectToFind: Project): Task[] {
    const tasks: Task[] = [];
    user?.teams.forEach((team: Team) => {
        team.projects.forEach((project: Project) => {
            if (project.name === projectToFind.name) {
                project.tasks.forEach((task: Task) => {
                    tasks.push(task);
                });
            }
        });
    });
    return tasks;
}

interface DashboardTask {
    tasks: TaskElement[];
    count: number;
}

export function getDashboardTasks(user: User): DashboardTask {
    const tasks: TaskElement[] = [];
    let count: number = 0;
    user.teams.forEach((team: Team) => {
        team.projects.forEach((project: Project) => {
            project.tasks.forEach((task: Task) => {
                if (task.isArchived) return;
                tasks.push({
                    id: task.id,
                    name: task.name,
                    description: task.description,
                    topic: task.topic,
                    status: task.status,
                    priority: task.priority,
                    deadline: task.deadline,
                    isArchived: task.isArchived,
                    duration: task.duration,
                    bookedDuration: task.bookedDuration,
                    createdBy: task.createdBy,
                    createdDate: task.createdDate,
                    lastModifiedBy: task.lastModifiedBy,
                    lastModifiedDate: task.lastModifiedDate,
                    project: project,
                    team: team
                });
                count++;
            });
        });
    });
    return {
        tasks: tasks.filter((task: TaskElement) => task.status !== "FINISHED")
                    .sort((a: TaskElement, b: TaskElement) => {
                        const priorityOrder = {LOW: 1, MEDIUM: 2, HIGH: 3};
                        const aPriority = a.priority ? priorityOrder[a.priority as keyof typeof priorityOrder] : 0;
                        const bPriority = b.priority ? priorityOrder[b.priority as keyof typeof priorityOrder] : 0;
                        return bPriority - aPriority;
            }),
        count: count
    };
}