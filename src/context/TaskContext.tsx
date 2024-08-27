"use client";

import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {
    createTask,
    deleteTask,
    NewTask, queryTasks,
    Task,
    updateTask,
    UpdateTask
} from "@/action/task";
import {ActionResult} from "@/action/actions";
import {eq} from "drizzle-orm";
import {teamMembers} from "@/schema";

interface ErrorState {
    teams?: string;
    tasks?: { [teamId: number]: string };
    general?: string;
}

interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    error: ErrorState;

    actions: {
        createTask: typeof createTask;
        updateTask: typeof updateTask;
        deleteTask: typeof deleteTask;
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
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorState>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError({});

            const resultTasks = await queryTasks({
                where: eq(teamMembers.userId, id),
                with: {
                    topics: true,
                    createdBy: true,
                    updatedBy: true,
                    project: {
                        with: {
                            team: true
                        }
                    }
                }
            })

            if (!resultTasks.success) {
                setError(prev => ({...prev, tasks: resultTasks.error}));
                setLoading(false)
                return
            }

            setTasks(resultTasks.data)
            setLoading(false)
        };

        fetchData();
    }, [id]);

    const actions = {
        createTask: async (newTask: NewTask): Promise<ActionResult<Task>> => {
            const result = await createTask(newTask);
            if (!result.success) {
                setError(prev => ({...prev, tasks: result.error}));
                return {success: false, error: result.error};
            }

            setTasks(prev => [...prev, result.data]);
            return {success: true, data: result.data};
        },
        updateTask: async (id: number, newTask: UpdateTask): Promise<ActionResult<Task>> => {
            const result = await updateTask(id, newTask);
            if (!result.success) {
                setError(prev => ({...prev, tasks: result.error}));
                return {success: false, error: result.error};
            }

            setTasks(prev => [...prev, result.data]);
            return {success: true, data: result.data};
        },
        deleteTask: async (id: number): Promise<ActionResult<boolean>> => {
            const result = await deleteTask(id);
            if (!result.success) {
                setError(prev => ({...prev, tasks: result.error}));
                return {success: false, error: result.error};
            }

            setTasks(prev => prev.filter(task => task?.id !== id));
            return {success: true, data: true};
        }
    };

    return (
        <TaskContext.Provider value={{tasks, loading, error, actions}}>
            {children}
        </TaskContext.Provider>
    );
};