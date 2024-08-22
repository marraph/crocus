"use client";

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getUser, updateUser, UpdateUser, User} from "@/action/user";
import {getTeamsFromUser} from "@/action/member";
import {
    createOrganisation, deleteOrganisation,
    getOrganisationsFromUser,
    NewOrganisation,
    Organisation, updateOrganisation,
    UpdateOrganisation
} from "@/action/organisation";
import {createTeam, deleteTeam, NewTeam, Team, updateTeam, UpdateTeam} from "@/action/team";
import {ActionResult} from "@/action/actions";
import {TaskElement} from "@/context/TaskContext";

interface UserContextType {
    user: User | null;
    organisations: Organisation[];
    teams: Team[];
    
    loading: { 
        user: boolean;
        organisations: boolean;
        teams: boolean;
    };
    
    error: { 
        user?: string | null;
        organisations?: string | null;
        teams?: string | null;
    };

    actions: {
        createOrganisation: (newOrganisation: NewOrganisation) => Promise<ActionResult<Organisation>>;
        updateOrganisation: (id: number, updateOrganisation: UpdateOrganisation) => Promise<ActionResult<Organisation>>;
        deleteOrganisation: (id: number) => Promise<void>;
        
        createTeam: (newTeam: NewTeam) => Promise<ActionResult<Team>>;
        updateTeam: (id: number, updateTeam: UpdateTeam) => Promise<ActionResult<Team>>;
        deleteTeam: (id: number) => Promise<void>;
        
        updateUser: (id: number, updateUser: UpdateUser) => Promise<ActionResult<User>>;
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
    const [user, setUser] = useState<User | null>(null);
    const [organisations, setOrganisations] = useState<Organisation[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<{user: boolean, organisations: boolean, teams: boolean}>({user: true, organisations: true, teams: true});
    const [error, setError] = useState<{user: string | null, organisations: string | null, teams: string | null}>({user: null, organisations: null, teams: null});

    useEffect(() => {
        const fetchData = async () => {
            setLoading({user: true, organisations: true, teams: true});
            setError({user: null, organisations: null, teams: null});

            try {
                const user = await getUser(id);
                if (user.success) {
                    setUser(user.data);
                } else {
                    setError({user: user.error, organisations: error.organisations, teams: error.teams});
                }
            } catch (err) {
                setError({
                    user: 'An unexpected error occurred while fetching data',
                    organisations: error.organisations,
                    teams: error.teams
                });
            } finally {
                setLoading({user: false, organisations: loading.organisations, teams: loading.teams});
            }

            try {
                const organisations = await getOrganisationsFromUser(id);
                if (organisations.success) {
                    setOrganisations(organisations.data);
                } else {
                    setError({user: error.user, organisations: organisations.error, teams: error.teams});
                }
            } catch (err) {
                setError({
                    user: error.user,
                    organisations: 'An unexpected error occurred while fetching data',
                    teams: error.teams
                });
            } finally {
                setLoading({user: loading.user, organisations: false, teams: loading.teams});
            }

            try {
                const teams = await getTeamsFromUser(id);
                if (teams.success) {
                    setTeams(teams.data);
                } else {
                    setError({user: error.user, organisations: error.organisations, teams: teams.error});
                }
            } catch (err) {
                setError({
                    user: error.user,
                    organisations: error.organisations,
                    teams: 'An unexpected error occurred while fetching data'
                });
            } finally {
                setLoading({user: loading.user, organisations: loading.organisations, teams: false});
            }
        };

        fetchData();
    }, [error.organisations, error.teams, error.user, id, loading.organisations, loading.teams, loading.user]);

    const actions = {
        createOrganisation: async (newOrganisation: NewOrganisation) => {
            const result = await createOrganisation(newOrganisation);
            if (result.success) {
                setOrganisations(prev => [...prev, result.data]);
            }
            return result;
        },
        updateOrganisation: async (id: number, newOrganisation: UpdateOrganisation) => {
            const result = await updateOrganisation(id, newOrganisation);
            if (result.success) {
                setOrganisations(prev => prev.map(o => o.id === id ? result.data : o));
            }
            return result;
        },
        deleteOrganisation: async (id: number) => {
            await deleteOrganisation(id);
            setOrganisations(prev => prev.filter(o => o.id !== id));
        },
        createTeam: async (newTeam: NewTeam) => {
            const result = await createTeam(newTeam);
            if (result.success) {
                setTeams(prev => [...prev, result.data]);
            }
            return result;
        },
        updateTeam: async (id: number, newTeam: UpdateTeam) => {
            const result = await updateTeam(id, newTeam);
            if (result.success) {
                setTeams(prev => prev.map(t => t.id === id ? result.data : t));
            }
            return result;
        },
        deleteTeam: async (id: number) => {
            await deleteTeam(id);
            setTeams(prev => prev.filter(t => t.id !== id));
        },
        updateUser: async (id: number, newUser: UpdateUser) => {
            const result = await updateUser(id, newUser);
            if (result.success) {
                setUser(result.data);
            }
            return result;
        }
    }

    return (
        <UserContext.Provider value={{ user, organisations, teams, loading, error, actions }}>
            {children}
        </UserContext.Provider>
    );
};