"use client";

import React, {createContext, ReactNode, useContext} from 'react';
import {Task} from "@/types/types";
import {getTask} from "@/service/hooks/taskHook";

interface TaskContextType {
    data: Task | undefined;
    isLoading: boolean;
    error: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = (): TaskContextType => {
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

export const TaskProvider: React.FC<TaskProviderProps> = ({ children, id }) => {
    const { data, isLoading, error } = getTask(id);

    console.log(data);

    return (
        <TaskContext.Provider value={{data, isLoading, error}}>
            {children}
        </TaskContext.Provider>
    );
};