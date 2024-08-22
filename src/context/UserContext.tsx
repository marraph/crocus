"use client";

import React, {createContext, ReactNode, useContext} from 'react';
import {getUser, User} from "@/action/user";
import {getTeamsFromUser} from "@/action/member";
import {getOrganisationsFromUser, Organisation} from "@/action/organisation";
import {Team} from "@/action/team";

interface UserContextType {
    user: User;
    organisations: Organisation[];
    teams: Team[];
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

export const UserProvider: React.FC<UserProviderProps> = async ({children, id}) => {
    const userResult = await getUser(id);
    const organisationResult = await getOrganisationsFromUser(id);
    const teamResult = await getTeamsFromUser(id);

    if (!userResult.success)  {
        return (
            <div>
                <h1>Something went wrong</h1>
                <p>{userResult.error}</p>
            </div>
        );
    }

    if (!organisationResult.success)  {
        return (
            <div>
                <h1>Something went wrong</h1>
                <p>{organisationResult.error}</p>
            </div>
        );
    }

    if (!teamResult.success)  {
        return (
            <div>
                <h1>Something went wrong</h1>
                <p>{teamResult.error}</p>
            </div>
        );
    }

    return (
        <UserContext.Provider value={{
            user: userResult.data,
            organisations: organisationResult.data,
            teams: teamResult.data
        }}
        >
            {children}
        </UserContext.Provider>
    );
};