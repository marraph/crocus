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
            cn("w-full h-10 flex flex-row items-center text-sm text-zinc-500 dark:text-gray rounded-lg font-normal cursor-pointer " +
                "bg-zinc-100 dark:bg-black-light hover:bg-zinc-200 dark:hover:bg-dark-light hover:text-zinc-800 dark:hover:text-white truncate",
            {"bg-zinc-200 dark:bg-dark-light text-zinc-800 dark:text-white border border-zinc-300 dark:border-edge": selected})
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