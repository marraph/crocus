"use client";

import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {ActionResult} from "@/action/actions";
import {
    createTimeEntry,
    deleteTimeEntry,
    NewTimeEntry, queryTimeEntries,
    TimeEntry,
    updateTimeEntry,
    UpdateTimeEntry
} from "@/action/timeEntry";
import {
    Absence,
    createAbsence,
    deleteAbsence,
    NewAbsence, queryAbsences,
    updateAbsence,
    UpdateAbsence
} from "@/action/absence";
import {eq} from "drizzle-orm";
import {absences, teamMembers} from "@/schema";
import {DBQueryConfig} from "drizzle-orm/relations";

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
        createAbsence: typeof createAbsence
        updateAbsence: typeof updateAbsence
        deleteAbsence: typeof deleteAbsence

        createTimeEntry: typeof createTimeEntry
        updateTimeEntry: typeof updateTimeEntry
        deleteTimeEntry: typeof deleteTimeEntry
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

const getTimeEntriesQueryConfig = (id: number): DBQueryConfig => ({
    with: {
        createdBy: true,
        updatedBy: true,
        project: {
            with: {
                team: {
                    with: {
                        teamMembers: {
                            where: eq(teamMembers.userId, id)
                        }
                    }
                }
            }
        }
    }
});

const getAbsencesQueryConfig = (id: number): DBQueryConfig => ({
    where: eq(absences.createdBy, id),
    with: {
        createdBy: true,
        updatedBy: true,
    }
})

export const TimeProvider: React.FC<TimeProviderProps> = async ({children, id}) => {
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState<{ entries: boolean, absences: boolean }>({entries: true, absences: true});
    const [error, setError] = useState<{ entries: string | null, absences: string | null }>({
        entries: null,
        absences: null
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading({entries: true, absences: true});
            setError({entries: null, absences: null});

            const timeEntryResults = await queryTimeEntries(getTimeEntriesQueryConfig(id));
            if (timeEntryResults.success) setEntries(timeEntryResults.data);
            else setError({entries: timeEntryResults.error, absences: error.absences});
            setLoading({entries: false, absences: loading.absences});

            const absenceResults = await queryAbsences(getAbsencesQueryConfig(id));
            if (absenceResults.success) setAbsences(absenceResults.data);
            else setError({entries: error.entries, absences: absenceResults.error});
            setLoading({entries: loading.entries, absences: false});
        };

        fetchData();
    }, [error.absences, error.entries, id, loading.absences, loading.entries]);

    const actions = {
        createAbsence: async (newAbsence: NewAbsence): Promise<ActionResult<Absence>> => {
            const createResult = await createAbsence(newAbsence);
            if (!createResult.success) {
                setError(prev => ({...prev, absences: createResult.error}));
                return {success: false, error: createResult.error};
            }

            setAbsences(prev => [...prev, createResult.data]);
            return {success: true, data: createResult.data};
        },
        updateAbsence: async (id: number, newAbsence: UpdateAbsence): Promise<ActionResult<Absence>> => {
            const updateResult = await updateAbsence(id, newAbsence);
            if (!updateResult.success) {
                setError(prev => ({...prev, absences: updateResult.error}));
                return {success: false, error: updateResult.error};
            }

            setAbsences(prev => prev.map(t => t.id === id ? updateResult.data : t));
            return {success: true, data: updateResult.data};
        },
        deleteAbsence: async (id: number): Promise<ActionResult<boolean>> => {
            const deleteResult = await deleteAbsence(id);
            if (!deleteResult.success) {
                setError(prev => ({...prev, absences: deleteResult.error}));
                return {success: false, error: deleteResult.error};
            }

            setAbsences(prev => prev.filter(t => t.id !== id));
            return {success: true, data: true};
        },
        createTimeEntry: async (newTimeEntry: NewTimeEntry): Promise<ActionResult<TimeEntry>> => {
            const createResult = await createTimeEntry(newTimeEntry);
            if (!createResult.success) {
                setError(prev => ({...prev, entries: createResult.error}));
                return {success: false, error: createResult.error};
            }

            setEntries(prev => [...prev, createResult.data]);
            return {success: true, data: createResult.data};
        },
        updateTimeEntry: async (id: number, newTmeEntry: UpdateTimeEntry): Promise<ActionResult<TimeEntry>> => {
            const updateResult = await updateTimeEntry(id, newTmeEntry);
            if (!updateResult.success) {
                setError(prev => ({...prev, entries: updateResult.error}));
                return {success: false, error: updateResult.error};
            }

            setEntries(prev => prev.map(t => t.id === id ? updateResult.data : t));
            return {success: true, data: updateResult.data};
        },
        deleteTimeEntry: async (id: number): Promise<ActionResult<boolean>> => {
            const deleteResult = await deleteTimeEntry(id);
            if (!deleteResult.success) {
                setError(prev => ({...prev, entries: deleteResult.error}));
                return {success: false, error: deleteResult.error};
            }

            setEntries(prev => prev.filter(t => t.id !== id));
            return {success: true, data: true};
        },
    }

    return (
        <TimeContext.Provider value={{entries, absences, loading, error, actions}}>
            {children}
        </TimeContext.Provider>
    )
}