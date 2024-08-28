"use client";

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {queryUser, updateUser, UpdateUser, User} from "@/action/user";
import {
    createOrganisation,
    deleteOrganisation,
    NewOrganisation, Organisation,
    updateOrganisation,
    UpdateOrganisation
} from "@/action/organisation";
import {createTeam, deleteTeam, NewTeam, Team, updateTeam, UpdateTeam} from "@/action/team";
import {ActionResult} from "@/action/actions";
import {CompletedUser} from "@/types/types";
import {userConfig} from "@/database/configurations/userQuery";

interface UserContextType {
    user: CompletedUser | null;
    loading: boolean
    error: string | null;

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

    const actions = {
        createOrganisation: async (newOrganisation: NewOrganisation): Promise<ActionResult<Organisation>> => {
            const createResult = await createOrganisation(newOrganisation);

            if (!createResult.success) {
                //     setError(prev => ({...prev, organisations: createResult.error}));
                return {success: false, error: createResult.error};
            }

            //    setUserData(prev => [...prev, createResult.data]);
            return {success: true, data: createResult.data};
        },
        updateOrganisation: async (id: number, newOrganisation: UpdateOrganisation): Promise<ActionResult<Organisation>> => {
            const updateResult = await updateOrganisation(id, newOrganisation);
            if (!updateResult.success) {
                //     setError(prev => ({...prev, organisations: updateResult.error}));
                return {success: false, error: updateResult.error};
            }

            //setUserData(prev => prev.map(o => o.id === id ? updateResult.data : o));
            return {success: true, data: updateResult.data};
        },
        deleteOrganisation: async (id: number): Promise<ActionResult<boolean>> => {
            const deleteResult = await deleteOrganisation(id);
            if (!deleteResult.success) {
                //      setError(prev => ({...prev, organisations: deleteResult.error}));
                return {success: false, error: deleteResult.error};
            }

            //  setUserData(prev => prev.filter(o => o.id !== id));
            return {success: true, data: true};
        },
        createTeam: async (newTeam: NewTeam): Promise<ActionResult<Team>> => {
            const createResult = await createTeam(newTeam);
            if (!createResult.success) {
                //    setError(prev => ({...prev, teams: createResult.error}));
                return {success: false, error: createResult.error};
            }

            // setUserData(prev => [...prev, createResult.data]);
            return {success: true, data: createResult.data};
        },
        updateTeam: async (id: number, newTeam: UpdateTeam): Promise<ActionResult<Team>> => {
            const updateResult = await updateTeam(id, newTeam);
            if (!updateResult.success) {
                //   setError(prev => ({...prev, teams: updateResult.error}));
                return {success: false, error: updateResult.error};
            }

            //   setUserData(prev => prev.map(t => t.id === id ? updateResult.data : t));
            return {success: true, data: updateResult.data};
        },
        deleteTeam: async (id: number): Promise<ActionResult<boolean>> => {
            const deleteResult = await deleteTeam(id);
            if (!deleteResult.success) {
                //     setError(prev => ({...prev, teams: deleteResult.error}));
                return {success: false, error: deleteResult.error};
            }
            // setUserData(prev => prev.filter(t => t.id !== id));
            return {success: true, data: true};
        },
        updateUser: async (id: number, newUser: UpdateUser): Promise<ActionResult<User>> => {
            const updateResult = await updateUser(id, newUser);
            if (!updateResult.success) {
                //     setError(prev => ({...prev, user: updateResult.error}));
                return {success: false, error: updateResult.error};
            }

            // setUser(updateResult.data);
            return {success: true, data: updateResult.data};
        }
    };

    return (
        <UserContext.Provider value={{user, loading, error, actions}}>
            {children}
        </UserContext.Provider>
    );
};