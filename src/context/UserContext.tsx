"use client";

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {queryUser} from "@/action/user";
import {ActionResult} from "@/action/actions";
import {ActionConsumerType, CompletedUser} from "@/types/types";
import {userConfig} from "@/database/configurations/userQuery";

interface UserContextType {
    user: CompletedUser | null;
    loading: boolean
    error: string | null;

    actionConsumer: (action: ActionConsumer) => {}
}

interface UserProviderProps {
    children: ReactNode;
    id: number;
}

interface ActionConsumer {
    consumer: () => Promise<ActionResult<ActionConsumerType>>
    handler: (currentUser: CompletedUser, input: ActionConsumerType) => CompletedUser
    onSuccess?: (data: ActionConsumerType) => void
    onError?: (error: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider: React.FC<UserProviderProps> = async ({children, id}) => {
    const [user, setUser] = useState<CompletedUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await queryUser(userConfig(id))
            if (result.success && result.data) setUser(result.data as CompletedUser)
            else if (!result.success && result.error) setError(result.error)
            setLoading(false)
        };

        fetchData();
    }, [id, error, loading]);

    const actionConsumer = async (action: ActionConsumer) => {
        if (!user) return

        const actionResult = await action.consumer()

        if (!actionResult.success) {
            setError(actionResult.error)
            action.onError?.(actionResult.error)
            return
        }

        const completedUser = action.handler(user, actionResult.data)
        setUser(completedUser)
        action.onSuccess?.(actionResult.data)
    }

    return (
        <UserContext.Provider value={{user, loading, error, actionConsumer}}>
            {children}
        </UserContext.Provider>
    );
};