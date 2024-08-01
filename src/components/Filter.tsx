"use client";

import React, {forwardRef, HTMLAttributes, ReactNode, useImperativeHandle, useRef, useState} from "react";
import {ContextMenu, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Button} from "@marraph/daisy/components/button/Button";
import {Box, CircleAlert, LineChart, ListFilter, Tag, Users} from "lucide-react";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";

type FilterItem = {
    name: string;
    values: string[];
}

type SelectedFilter = {
    name: string;
    value: string;
}

interface FilterProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
    items: FilterItem[];
}

type FilterRef = {
    getFilters: () => SelectedFilter[];
}


const Filter = forwardRef<FilterRef, FilterProps>(({ title, items }, ref) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState<FilterItem | null>(null);
    const [filters, setFilters] = useState<SelectedFilter[]>([]);

    const menuRef = useOutsideClick(() => {
        setMenuOpen(false);
    });

    const handleMenuClick = (value: string) => {
        if (subMenuOpen) {
            const newFilter = { name: subMenuOpen.name, value: value };
            const updatedFilters = filters.filter(f => f.name !== newFilter.name);
            setFilters([...updatedFilters, newFilter]);
        }
        setSubMenuOpen(null);
    }

    useImperativeHandle(ref, () => ({
        getFilters: () => filters
    }));

    return (
        <div className={"flex flex-col space-y-10"}>
            <div className={"flex flex-row space-x-2 items-center"}>
                <Button text={title}
                        icon={<ListFilter size={16} className={"mr-2"}/>}
                        onClick={() => {
                            if (subMenuOpen) setMenuOpen(false);
                            else setMenuOpen(!menuOpen);
                            setSubMenuOpen(null);
                        }}
                />
                {filters && filters.map((filter, index) => (
                    <FilterBadge
                        key={index}
                        name={filter.name}
                        value={filter.value}
                        onClick={() => setFilters(filters.filter(f => f !== filter))}
                    />
                ))}
            </div>

            {
                <>
                    {menuOpen &&
                        <ContextMenu className={"fixed text-xs w-max py-1 shadow-2xl z-50"} ref={menuRef} >
                            {items.map((item, index) => (
                                <ContextMenuItem
                                    key={index}
                                    title={item.name}
                                    onClick={() => {
                                        setSubMenuOpen(item);
                                        setMenuOpen(false);
                                    }}
                                />
                            ))}
                        </ContextMenu>
                    }

                    {subMenuOpen &&
                        <ContextMenu className={"fixed text-xs w-max py-1 shadow-2xl z-50"} ref={menuRef}>
                            {subMenuOpen.values.map((value, index) => (
                                <ContextMenuItem
                                    key={index}
                                    title={value}
                                    onClick={() => handleMenuClick(value)}
                                />
                            ))}
                        </ContextMenu>
                    }
                </>
            }
        </div>
    );
});
Filter.displayName = "Filter";

interface FilterBadgeProps {
    name: string;
    value: string;
    onClick: () => void;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ name, value, onClick }) => {
    const icons: { [key: string]: ReactNode } = {
        Team: <Users size={16}/>,
        Project: <Box size={16}/>,
        Status: <CircleAlert size={16}/>,
        Topic: <Tag size={16}/>,
        Priority: <LineChart size={16}/>,
    };

    return (
        <div className={"h-6 flex flex-row items-center space-x-1 pl-2 bg-edge rounded-lg"}>
            {icons[name]}
            <span className={"text-xs text-white"}>{name + ":"}</span>
            <span className={"text-xs text-white-dark"}>{value}</span>
            <CloseButton className={"bg-edge hover:bg-edge"}
                         onClick={onClick}
            />
        </div>
    );
}

export {Filter};
export type {FilterRef};



