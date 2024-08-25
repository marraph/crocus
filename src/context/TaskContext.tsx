"use client";

import {Team} from "@/action/team";
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {getTeamsFromUser} from "@/action/member";
import {
    createTask,
    deleteTask,
    getTaskFromId,
    getTasksFromTeam,
    NewTask,
    Task,
    updateTask,
    UpdateTask
} from "@/action/task";
import {Project} from "@/action/projects";
import {ActionResult} from "@/action/actions";
import {Topic} from "@/action/topic";
import {User} from "@/action/user";

export type ComplexTask = {
    task: Task | null;
    team: Team | null;
    project: Project | null;
    topic: Topic | null;
    user: User | null;
};

interface ErrorState {
    teams?: string;
    tasks?: { [teamId: number]: string };
    general?: string;
}

interface TaskContextType {
    tasks: ComplexTask[];
    loading: boolean;
    error: ErrorState;

    actions: {
        createTask: (newTask: NewTask) => Promise<ActionResult<NewTask>>;
        updateTask: (id: number, updateTask: UpdateTask) => Promise<ActionResult<UpdateTask>>;
        deleteTask: (id: number) => Promise<ActionResult<boolean>>;
    };
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

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
    const [tasks, setTasks] = useState<ComplexTask[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorState>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError({});
            let tasks: ComplexTask[] = [];

            try {
                const teamResult = await getTeamsFromUser(id);

                if (!teamResult.success) {
                    setError(prev => ({ ...prev, teams: teamResult.error }));
                    return;
                }

                for (const team of teamResult.data) {

                    const taskResult = await getTasksFromTeam(team.id);

                    if (!taskResult.success) {
                        setError(prev => ({ ...prev, tasks: taskResult.error }));
                        continue;
                    }

                    for (const task of taskResult.data) {
                        tasks.push({
                            task: task,
                            team: team,
                            project: task.projects ?? null,
                            topic: task.topics ?? null,
                            user: task.users ?? null
                        })
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
        createTask: async (newTask: NewTask): Promise<ActionResult<NewTask>> => {
            try {
                const createResult = await createTask(newTask);
                if (!createResult.success) {
                    throw new Error(createResult.error || 'Failed to create task');
                }

                const getResult = await getTaskFromId(createResult.data.id);
                if (!getResult.success || !getResult.data) {
                    throw new Error(getResult.error || 'Failed to fetch created task');
                }

                const complexTask: ComplexTask = {
                    task: getResult.data.tasks ?? null,
                    team: getResult.data.teams ?? null,
                    project: getResult.data.projects ?? null,
                    topic: getResult.data.topics ?? null,
                    user: getResult.data.users ?? null
                };

                setTasks(prev => [...prev, complexTask]);
                return { success: true, data: createResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, tasks: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        updateTask: async (id: number, newTask: UpdateTask): Promise<ActionResult<UpdateTask>> => {
            try {
                const updateResult = await updateTask(id, newTask);
                if (!updateResult.success) {
                    throw new Error(updateResult.error || 'Failed to update task');
                }

                const getResult = await getTaskFromId(updateResult.data.id);
                if (!getResult.success || !getResult.data) {
                    throw new Error(getResult.error || 'Failed to fetch updated task');
                }

                const complexTask: ComplexTask = {
                    task: getResult.data.tasks ?? null,
                    team: getResult.data.teams ?? null,
                    project: getResult.data.projects ?? null,
                    topic: getResult.data.topics ?? null,
                    user: getResult.data.users ?? null
                };

                setTasks(prev => prev.map(task => task.task?.id === id ? { ...task, ...complexTask } : task));
                return { success: true, data: updateResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, tasks: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        deleteTask: async (id: number): Promise<ActionResult<boolean>> => {
            try {
                const result = await deleteTask(id);
                if (!result.success) {
                    throw new Error(result.error || 'Failed to delete task');
                }

                setTasks(prev => prev.filter(task => task.task?.id !== id));
                return { success: true, data: true };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, tasks: errorMessage }));
                return { success: false, error: errorMessage };
            }
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, loading, error, actions }}>
            {children}
        </TaskContext.Provider>
    );
};