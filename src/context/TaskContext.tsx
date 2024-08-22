"use client";

import {getTeam, Team} from "@/action/team";
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {getTeamsFromUser} from "@/action/member";
import {createTask, deleteTask, getTasksFromProject, NewTask, Task, updateTask, UpdateTask} from "@/action/task";
import {getProject, getProjectsFromTeam, Project} from "@/action/projects";

export type TaskElement = Task & {
    team: Team | null;
    project: Project | null;
};

interface ErrorState {
    teams?: string;
    projects?: { [teamId: number]: string };
    tasks?: { [projectId: number]: string };
    general?: string;
}

interface TaskContextType {
    tasks: TaskElement[];
    loading: boolean;
    error: ErrorState;

    actions: {
        createTask: (newTask: NewTask) => Promise<void>;
        updateTask: (id: number, updateTask: UpdateTask) => Promise<void>;
        deleteTask: (id: number) => Promise<void>;
    };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface TaskProviderProps {
    children: ReactNode;
    id: number;
}

export const TaskProvider: React.FC<TaskProviderProps> = async ({children, id}) => {
    const [tasks, setTasks] = useState<TaskElement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorState>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError({});
            let tasks: TaskElement[] = [];

            try {
                const teamResult = await getTeamsFromUser(id);

                if (!teamResult.success) {
                    setError(prev => ({ ...prev, teams: teamResult.error }));
                    return;
                }

                for (const team of teamResult.data) {
                    const projectResult = await getProjectsFromTeam(team.id);

                    if (!projectResult.success) {
                        setError(prev => ({
                            ...prev,
                            projects: { ...prev.projects, [team.id]: projectResult.error }
                        }));
                        continue;
                    }

                    for (const project of projectResult.data) {
                        const taskResult = await getTasksFromProject(project.id);

                        if (!taskResult.success) {
                            setError(prev => ({
                                ...prev,
                                tasks: { ...prev.tasks, [project.id]: taskResult.error }
                            }));
                            continue;
                        }

                        tasks.push(
                            ...taskResult.data.map(task => ({
                                ...task,
                                team,
                                project
                            }))
                        );
                    }
                }

                setTasks(tasks);
            } catch (err) {
                setError(prev => ({ ...prev, general: 'An unexpected error occurred while fetching data' }));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const actions = {
        createTask: async (newTask: NewTask) => {
            const result = await createTask(newTask);
            let project: Project;
            let team: Team;

            if (result.success) {
                const projectId = result.data.projectId;
                const projectResult = await getProject(projectId);

                if (projectResult.success) {
                    project = projectResult.data;
                    const teamId = project.teamId;
                    const teamResult = await getTeam(teamId);

                    if (teamResult.success) {
                        team = teamResult.data;
                    }
                }
                setTasks(prev => [...prev, { ...result.data, project: project, team: team }]);
            } else {
                setError(prev => ({ ...prev, tasks: result.error }));
            }
        },
        updateTask: async (id: number, newTask: UpdateTask) => {
            const result = await updateTask(id, newTask);
            if (result.success) {
                setTasks(prev => prev.map(task => task.id === id ? { ...task, ...newTask } : task));
            } else {
                setError(prev => ({ ...prev, tasks: result.error }));
            }
        },
        deleteTask: async (id: number) => {
            const result = await deleteTask(id);
            setTasks(prev => prev.filter(task => task.id !== id));
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, loading, error, actions }}>
            {children}
        </TaskContext.Provider>
    );
};