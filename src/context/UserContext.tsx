'use client'

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

export const UserProvider: React.FC<UserProviderProps> = ({children, id}) => {
    const [user, setUser] = useState<CompletedUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log("UserProvider rendering");

    useEffect(() => {
        console.log("useEffect triggered, id:", id);
    }, [id]);

    useEffect(() => {
        console.log("useEffect with no dependencies");
    }, []);

    useEffect(() => {
        console.log("useEffect triggered, id:", id);

        const fetchUser = async () => {
            console.log("fetchUser function called");
            setLoading(true);
            setError(null);
            try {
                console.log("Calling queryUser");
                const result = await queryUser(userConfig(id));
                console.log("queryUser result:", result);
                if (result.success && result.data) {
                    console.log("Setting user data");
                    setUser(result.data as CompletedUser);
                } else {
                    console.log("Setting error:", result.error);
                    setError(result.error || "Failed to fetch user");
                }
            } catch (err) {
                console.error("An error occurred:", err);
                setError("An unexpected error occurred");
            } finally {
                console.log("Setting loading to false");
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const actionConsumer = async (action: ActionConsumer) => {
        try {

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
        } catch (err) {
            console.error("Action consumer error:", err);
            setError("An error occurred during action execution");
            action.onError?.("An error occurred during action execution");
        }

    }

    return (
        <UserContext.Provider value={{user, loading, error, actionConsumer}}>
            {children}
        </UserContext.Provider>
    );
};