"use client";

import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {ActionResult} from "@/action/actions";
import {
    createTimeEntry,
    deleteTimeEntry,
    getTimeEntriesFromUser,
    NewTimeEntry,
    TimeEntry,
    updateTimeEntry,
    UpdateTimeEntry
} from "@/action/timeEntry";
import {
    Absence,
    createAbsence,
    deleteAbsence,
    getAbsencesFromUser,
    NewAbsence,
    updateAbsence,
    UpdateAbsence
} from "@/action/absence";

interface TimeContextType {
    entries: TimeEntry[];
    absences: Absence[];

    loading: {
        entries: boolean;
        absences: boolean;
    };

    error: {
        entries?: string | null;
        absences?: string | null;
    };

    actions: {
        createAbsence: (newAbsence: NewAbsence) => Promise<ActionResult<NewAbsence>>;
        updateAbsence: (id: number, updateAbsence: UpdateAbsence) => Promise<ActionResult<UpdateAbsence>>;
        deleteAbsence: (id: number) => Promise<ActionResult<boolean>>;

        createTimeEntry: (newTimeEntry: NewTimeEntry) => Promise<ActionResult<NewTimeEntry>>;
        updateTimeEntry: (id: number, updateTimeEntry: UpdateTimeEntry) => Promise<ActionResult<UpdateTimeEntry>>;
        deleteTimeEntry: (id: number) => Promise<ActionResult<boolean>>;
    };
}

export const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const useTime = (): TimeContextType => {
    const context = useContext(TimeContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface TimeProviderProps {
    children: ReactNode;
    id: number;
}

export const TimeProvider: React.FC<TimeProviderProps> = async ({children, id}) => {
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState<{entries: boolean, absences: boolean}>({entries: true, absences: true});
    const [error, setError] = useState<{entries: string | null, absences: string | null}>({entries: null, absences: null});

    useEffect(() => {
        const fetchData = async () => {
            setLoading({entries: true, absences: true});
            setError({entries: null, absences: null});

            try {
                const result = await getTimeEntriesFromUser(id);
                if (result.success) {
                    setEntries(result.data);
                } else {
                    setError({entries: result.error, absences: error.absences});
                }
            } catch (err) {
                setError({
                    entries: 'An unexpected error occurred while fetching data',
                    absences: error.absences
                });
            } finally {
                setLoading({entries: false, absences: loading.absences});
            }

            try {
                const result = await getAbsencesFromUser(id);
                if (result.success) {
                    setAbsences(result.data);
                } else {
                    setError({entries: error.entries, absences: result.error});
                }
            } catch (err) {
                setError({
                    entries: error.entries,
                    absences: 'An unexpected error occurred while fetching data',
                });
            } finally {
                setLoading({entries: loading.entries, absences: false});
            }
        };

        fetchData();
    }, [error.absences, error.entries, id, loading.absences, loading.entries]);

    const actions = {
        createAbsence: async (newAbsence: NewAbsence): Promise<ActionResult<NewAbsence>> => {
            try {
                const createResult = await createAbsence(newAbsence);
                if (!createResult.success) {
                    throw new Error(createResult.error || 'Failed to create absence');
                }

                setAbsences(prev => [...prev, createResult.data]);
                return { success: true, data: createResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, absences: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        updateAbsence: async (id: number, newAbsence: UpdateAbsence): Promise<ActionResult<UpdateAbsence>> => {
            try {
                const updateResult = await updateAbsence(id, newAbsence);
                if (!updateResult.success) {
                    throw new Error(updateResult.error || 'Failed to update absence');
                }

                setAbsences(prev => prev.map(t => t.id === id ? updateResult.data : t));
                return { success: true, data: updateResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, absences: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        deleteAbsence: async (id: number): Promise<ActionResult<boolean>> => {
            try {
                const deleteResult = await deleteAbsence(id);
                if (!deleteResult.success) {
                    throw new Error(deleteResult.error || 'Failed to delete absence');
                }

                setAbsences(prev => prev.filter(t => t.id !== id));
                return { success: true, data: true };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, absences: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        createTimeEntry: async (newTimeEntry: NewTimeEntry): Promise<ActionResult<NewTimeEntry>> => {
            try {
                const createResult = await createTimeEntry(newTimeEntry);
                if (!createResult.success) {
                    throw new Error(createResult.error || 'Failed to create time-entry');
                }

                setEntries(prev => [...prev, createResult.data]);
                return { success: true, data: createResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, entries: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        updateTimeEntry: async (id: number, newTmeEntry: UpdateTimeEntry): Promise<ActionResult<UpdateTimeEntry>> => {
            try {
                const updateResult = await updateTimeEntry(id, newTmeEntry);
                if (!updateResult.success) {
                    throw new Error(updateResult.error || 'Failed to update time-entry');
                }

                setEntries(prev => prev.map(t => t.id === id ? updateResult.data : t));
                return { success: true, data: updateResult.data };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, entries: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
        deleteTimeEntry: async (id: number): Promise<ActionResult<boolean>> => {
            try {
                const deleteResult = await deleteTimeEntry(id);
                if (!deleteResult.success) {
                    throw new Error(deleteResult.error || 'Failed to delete time-entry');
                }

                setEntries(prev => prev.filter(t => t.id !== id));
                return { success: true, data: true };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(prev => ({ ...prev, entries: errorMessage }));
                return { success: false, error: errorMessage };
            }
        },
    }

    return (
        <TimeContext.Provider value={{ entries, absences, loading, error, actions }}>
            {children}
        </TimeContext.Provider>
    )
}