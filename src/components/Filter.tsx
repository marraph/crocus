"use client";

import React, {forwardRef, HTMLAttributes, ReactNode, useImperativeHandle, useState} from "react";
import {ContextMenu, ContextMenuContainer, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Button} from "@marraph/daisy/components/button/Button";
import {Box, Check, CircleAlert, LineChart, ListFilter, Tag, Users} from "lucide-react";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {TaskElement} from "@/types/types";
import {cn} from "@/utils/cn";

type FilterItem = {
    name: string;
    values: string[];
}

type SelectedFilter = {
    name: keyof TaskElement;
    value: string;
}

interface FilterProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
    items: FilterItem[];
    onChange: () => void;
}

type FilterRef = {
    getFilters: () => SelectedFilter[];
}


const Filter = forwardRef<FilterRef, FilterProps>(({ title, items, onChange }, ref) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState<FilterItem | null>(null);
    const [filters, setFilters] = useState<SelectedFilter[]>([]);

    const menuRef = useOutsideClick(() => {
        setMenuOpen(false);
        setSubMenuOpen(null);
    });

    const handleMenuClick = (item: FilterItem) => {
        setSubMenuOpen(item);
    }

    const handleSubMenuClick = (value: string) => {
        if (subMenuOpen) {
            const newFilter = { name: subMenuOpen.name as keyof TaskElement, value: value };
            const updatedFilters = filters.filter(f => f.name !== newFilter.name);
            setFilters([...updatedFilters, newFilter]);
            onChange();
        }
        setSubMenuOpen(null);
        setMenuOpen(false);
    }

    useImperativeHandle(ref, () => ({
        getFilters: () => filters
    }));

    return (
        <div className={"relative flex flex-col space-y-10"} ref={menuRef}>
            <div className={"flex flex-row space-x-2 items-center"}>
                <Button text={title}
                        icon={<ListFilter size={16} className={"mr-2"}/>}
                        onClick={() => {
                            setMenuOpen(!menuOpen);
                            setSubMenuOpen(null);
                        }}
                />
                {filters && filters.map((filter, index) => (
                    <FilterBadge
                        key={index}
                        name={filter.name}
                        value={filter.value}
                        onClick={() => {
                            setFilters(filters.filter(f => f !== filter));
                            onChange();
                        }}
                    />
                ))}
            </div>

            {menuOpen && !subMenuOpen &&
                <div className={"absolute z-50 bg-black border border-edge rounded-lg text-sm text-gray p-1 space-y-1"}>
                    {items.map((item, index) => (
                        <div className={"px-2 py-1 rounded-lg hover:bg-dark hover:text-white cursor-pointer"}
                            key={index}
                            onClick={() => handleMenuClick(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            }

            {subMenuOpen &&
                <div className={"absolute z-50 bg-black border border-edge rounded-lg text-sm text-gray p-1 space-y-1"}>
                    {subMenuOpen.values.map((value, index) => (
                        <div className={cn("flex flex-row space-x-2 items-center px-2 py-1 rounded-lg hover:bg-dark hover:text-white cursor-pointer",
                            { "bg-dark text-white": filters.some(f => f.name === subMenuOpen.name && f.value === value) })}
                            key={index}
                            onClick={() => handleSubMenuClick(value)}
                        >
                            {filters.some(f => f.name === subMenuOpen.name && f.value === value) &&
                                <Check size={16}/>
                            }
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
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
export type {FilterRef, SelectedFilter};



