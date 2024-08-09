"use client";

import React, {createContext, ReactNode, useContext, useState} from "react";
import {cn} from "@/utils/cn";

interface NavigationItemProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    icon: ReactNode;
    selected: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ title, icon, selected, ...props }) => {
    return (
        <div className={
            cn("w-full flex items-center text-sm text-gray rounded-lg font-normal cursor-pointer border border-edge border-opacity-0 bg-black-light hover:bg-dark-light hover:text-white truncate",
            {"bg-dark-light text-white border-opacity-100": selected})
        }
            {...props}
        >
            <div className={cn("m-2 ml-4 mr-2")}>
                {icon}
            </div>
            <p className={"m-2"}>
                {title}
            </p>
        </div>
    );
};

interface NavigationContextProps {
    selectedItem: string;
    setSelectedItem: (item: string) => void;
}

const NavigationContext = createContext<NavigationContextProps>({
    selectedItem: '',
    setSelectedItem: () => {}
});

const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedItem, setSelectedItem] = useState<string>('');

    return (
        <NavigationContext.Provider value={{ selectedItem, setSelectedItem }}>
            {children}
        </NavigationContext.Provider>
    );
};

const useNavigation = () => useContext(NavigationContext);

export { NavigationItem, NavigationProvider, useNavigation };