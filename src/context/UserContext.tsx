"use client";

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getUser, updateUser, UpdateUser, User} from "@/action/user";
import {
    createOrganisation,
    deleteOrganisation,
    NewOrganisation,
    Organisation, queryOrganisations,
    updateOrganisation,
    UpdateOrganisation
} from "@/action/organisation";
import {createTeam, deleteTeam, NewTeam, Team, updateTeam, UpdateTeam} from "@/action/team";
import {ActionResult} from "@/action/actions";
import {eq} from "drizzle-orm";
import {organisationMembers, teamMembers} from "@/schema";
import {DBQueryConfig} from "drizzle-orm/relations";

interface UserContextType {
    user: User | null;
    userData: Organisation[];

    loading: {
        user: boolean;
        userData: boolean;
    };

    error: {
        user?: string | null;
        userData?: string | null;
    };

    actions: {
        createOrganisation: typeof createOrganisation
        updateOrganisation: typeof updateOrganisation
        deleteOrganisation: typeof deleteOrganisation

        createTeam: typeof createTeam
        updateTeam: typeof updateTeam
        deleteTeam: typeof deleteTeam

        updateUser: typeof updateUser
    };
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

const queryOrganisationTeamConfig = (id: number): DBQueryConfig => ({
    with: {
        organisationMembers: {
            where: eq(organisationMembers.userId, id),
        },
        createdBy: true,
        updatedBy: true,
        teams: {
            with: {
                teamMembers: {
                    where: eq(teamMembers.userId, id)
                }
            }
        }
    }
})

export const UserProvider: React.FC<UserProviderProps> = async ({children, id}) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<Organisation[]>([]);
    const [loading, setLoading] = useState<{ user: boolean, userData: boolean }>({
        user: true,
        userData: true,
    });
    const [error, setError] = useState<{
        user: string | null,
        userData: string | null,
    }>({user: null, userData: null});

    useEffect(() => {
        const fetchData = async () => {
            setLoading({user: true, userData: true});
            setError({user: null, userData: null});

            const [user, userData] = await Promise.all([
                getUser(id),
                queryOrganisations(queryOrganisationTeamConfig(id))
            ])

            if (user.success) setUser(user.data);
            else setError(prev => ({...prev, user: user.error}));
            setLoading(prev => ({...prev, user: false}));

            if (userData.success) setUserData(userData.data);
            else setError(prev => ({...prev, userData: error.userData}));
            setLoading(prev => ({...prev, userData: false}));
        };

        fetchData();
    }, [id, error.user, error.userData, loading.user, loading.userData]);

    const actions = {
        createOrganisation: async (newOrganisation: NewOrganisation): Promise<ActionResult<Organisation>> => {
            const createResult = await createOrganisation(newOrganisation);

            if (!createResult.success) {
                setError(prev => ({...prev, organisations: createResult.error}));
                return {success: false, error: createResult.error};
            }

            setUserData(prev => [...prev, createResult.data]);
            return {success: true, data: createResult.data};
        },
        updateOrganisation: async (id: number, newOrganisation: UpdateOrganisation): Promise<ActionResult<Organisation>> => {
            const updateResult = await updateOrganisation(id, newOrganisation);
            if (!updateResult.success) {
                setError(prev => ({...prev, organisations: updateResult.error}));
                return {success: false, error: updateResult.error};
            }

            setUserData(prev => prev.map(o => o.id === id ? updateResult.data : o));
            return {success: true, data: updateResult.data};
        },
        deleteOrganisation: async (id: number): Promise<ActionResult<boolean>> => {
            const deleteResult = await deleteOrganisation(id);
            if (!deleteResult.success) {
                setError(prev => ({...prev, organisations: deleteResult.error}));
                return {success: false, error: deleteResult.error};
            }

            setUserData(prev => prev.filter(o => o.id !== id));
            return {success: true, data: true};
        },
        createTeam: async (newTeam: NewTeam): Promise<ActionResult<Team>> => {
            const createResult = await createTeam(newTeam);
            if (!createResult.success) {
                setError(prev => ({...prev, teams: createResult.error}));
                return {success: false, error: createResult.error};
            }

            setUserData(prev => [...prev, createResult.data]);
            return {success: true, data: createResult.data};
        },
        updateTeam: async (id: number, newTeam: UpdateTeam): Promise<ActionResult<Team>> => {
            const updateResult = await updateTeam(id, newTeam);
            if (!updateResult.success) {
                setError(prev => ({...prev, teams: updateResult.error}));
                return {success: false, error: updateResult.error};
            }

            setUserData(prev => prev.map(t => t.id === id ? updateResult.data : t));
            return {success: true, data: updateResult.data};
        },
        deleteTeam: async (id: number): Promise<ActionResult<boolean>> => {
            const deleteResult = await deleteTeam(id);
            if (!deleteResult.success) {
                setError(prev => ({...prev, teams: deleteResult.error}));
                return {success: false, error: deleteResult.error};
            }
            setUserData(prev => prev.filter(t => t.id !== id));
            return {success: true, data: true};
        },
        updateUser: async (id: number, newUser: UpdateUser): Promise<ActionResult<User>> => {
            const updateResult = await updateUser(id, newUser);
            if (!updateResult.success) {
                setError(prev => ({...prev, user: updateResult.error}));
                return {success: false, error: updateResult.error};
            }

            setUser(updateResult.data);
            return {success: true, data: updateResult.data};
        }
    };

    return (
        <UserContext.Provider value={{user, userData, loading, error, actions}}>
            {children}
        </UserContext.Provider>
    );
};