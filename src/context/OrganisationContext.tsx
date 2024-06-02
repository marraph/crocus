"use client";

import React, {createContext, ReactNode, useContext} from 'react';
import {Organisation} from "@/types/types";
import {getOrganisation} from "@/service/hooks/organisationHook";

interface OrganisationContextType {
    data: Organisation | undefined;
    isLoading: boolean;
    error: string | null;
}

const OrganisationContext = createContext<OrganisationContextType | undefined>(undefined);

export const useOrganisation = (): OrganisationContextType => {
    const context = useContext(OrganisationContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface OrganisationProviderProps {
    children: ReactNode;
    id: number;
}

export const OrganisationProvider: React.FC<OrganisationProviderProps> = ({ children, id}) => {
    const { data, isLoading, error } = getOrganisation(id);

    return (
        <OrganisationContext.Provider value={{data, isLoading, error}}>
            {children}
        </OrganisationContext.Provider>
    );
};