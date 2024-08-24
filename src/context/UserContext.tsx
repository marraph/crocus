"use client";

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getUser, updateUser, UpdateUser, User} from "@/action/user";
import {getTeamsFromUser} from "@/action/member";
import {
    createOrganisation,
    deleteOrganisation,
    getOrganisationsFromUser,
    NewOrganisation,
    Organisation,
    updateOrganisation,
    UpdateOrganisation
} from "@/action/organisation";
import {createTeam, deleteTeam, NewTeam, Team, updateTeam, UpdateTeam} from "@/action/team";
import {ActionResult} from "@/action/actions";

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
        createOrganisation: (newOrganisation: NewOrganisation) => Promise<ActionResult<NewOrganisation>>;
        updateOrganisation: (id: number, updateOrganisation: UpdateOrganisation) => Promise<ActionResult<UpdateOrganisation>>;
        deleteOrganisation: (id: number) => Promise<void>;
        
        createTeam: (newTeam: NewTeam) => Promise<ActionResult<NewTeam>>;
        updateTeam: (id: number, updateTeam: UpdateTeam) => Promise<ActionResult<UpdateTeam>>;
        deleteTeam: (id: number) => Promise<void>;
        
        updateUser: (id: number, updateUser: UpdateUser) => Promise<ActionResult<UpdateUser>>;
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
        createOrganisation: async (newOrganisation: NewOrganisation): Promise<ActionResult<NewOrganisation>> => {
            try {
                const createResult = await createOrganisation(newOrganisation);
                if (!createResult.success) {
                    throw new Error(createResult.error || 'Failed to create organisation');
                }

                setOrganisations(prev => [...prev, createResult.data]);
                return { success: true, data: createResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, organisations: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        updateOrganisation: async (id: number, newOrganisation: UpdateOrganisation): Promise<ActionResult<UpdateOrganisation>> => {
            try {
                const updateResult = await updateOrganisation(id, newOrganisation);
                if (!updateResult.success) {
                    throw new Error(updateResult.error || 'Failed to update organisation');
                }

                setOrganisations(prev => prev.map(o => o.id === id ? updateResult.data : o));
                return { success: true, data: updateResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, organisations: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        deleteOrganisation: async (id: number): Promise<void> => {
            try {
                const deleteResult = await deleteOrganisation(id);
                setOrganisations(prev => prev.filter(o => o.id !== id));
                return deleteResult;

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, organisations: errorMessage }));
                return;
            }
        },
        createTeam: async (newTeam: NewTeam): Promise<ActionResult<NewTeam>> => {
            try {
                const createResult = await createTeam(newTeam);
                if (!createResult.success) {
                    throw new Error(createResult.error || 'Failed to create team');
                }

                setTeams(prev => [...prev, createResult.data]);
                return { success: true, data: createResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, teams: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        updateTeam: async (id: number, newTeam: UpdateTeam): Promise<ActionResult<UpdateTeam>> => {
            try {
                const updateResult = await updateTeam(id, newTeam);
                if (!updateResult.success) {
                    throw new Error(updateResult.error || 'Failed to update team');
                }

                setTeams(prev => prev.map(t => t.id === id ? updateResult.data : t));
                return { success: true, data: updateResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, teams: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        deleteTeam: async (id: number): Promise<void> => {
            try {
                const deleteResult = await deleteTeam(id);
                setTeams(prev => prev.filter(t => t.id !== id));
                return deleteResult;

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, teams: errorMessage }));
                return;
            }
        },
        updateUser: async (id: number, newUser: UpdateUser): Promise<ActionResult<UpdateUser>> => {
            try {
                const updateResult = await updateUser(id, newUser);
                if (!updateResult.success) {
                    throw new Error(updateResult.error || 'Failed to update user');
                }

                setUser(updateResult.data);
                return { success: true, data: updateResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, user: errorMessage }));
                return { success: false, error: errorMessage };
            }
        }
    };

    return (
        <UserContext.Provider value={{ user, organisations, teams, loading, error, actions }}>
            {children}
        </UserContext.Provider>
    );
};