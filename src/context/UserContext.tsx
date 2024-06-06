"use client";

import React, {createContext, ReactNode, useContext} from 'react';
import {getUser} from "@/service/hooks/userHook";
import {User} from "@/types/types";

interface UserContextType {
    data: User | undefined;
    isLoading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
    id: number;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children, id }) => {
    const { data, isLoading, error } = getUser(id);

    return (
        <UserContext.Provider value={{data, isLoading, error}}>
            {children}
        </UserContext.Provider>
    );
};