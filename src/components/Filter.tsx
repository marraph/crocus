"use client";

import React, {ReactNode, useState} from "react";
import {ContextMenu, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Button} from "@marraph/daisy/components/button/Button";
import {Box, ChevronDown, ChevronUp, CircleAlert, LineChart, Tag, Users} from "lucide-react";
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

interface FilterProps {
    title: string;
    items: FilterItem[];
}


const Filter: React.FC<FilterProps> = ({ title, items, ...props }) => {
    const [isOpen, setOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<FilterItem | null>(null);
    const [filters, setFilters] = useState<SelectedFilter[] | null>(null);

    const menuRef = useOutsideClick(() => {
        setOpen(false);
    });

    const icons: { [key: string]: ReactNode } = {
        Team: <Users size={16}/>,
        Project: <Box size={16}/>,
        Status: <CircleAlert size={16}/>,
        Topic: <Tag size={16}/>,
        Priority: <LineChart size={16}/>,
    };

    return (
        <div className={"flex flex-col space-y-10"}>
            <div className={"flex flex-row space-x-2 items-center"}>
                <Button text={title}
                        onClick={() => {
                            if (openMenu) setOpen(false);
                            else setOpen(!isOpen);
                            setOpenMenu(null);
                        }}
                        icon={isOpen ? <ChevronUp size={16} className={"mr-2"}/> : <ChevronDown size={16} className={"mr-2"}/>}
                        {...props}
                />
                {filters && filters.map((filter, index) => (
                    <div key={index} className={"h-6 flex flex-row items-center space-x-1 pl-2 bg-edge rounded-lg"}>
                        {icons[filter.name]}
                        <span className={"text-xs text-white"}>{filter.name + ":"}</span>
                        <span className={"text-xs text-white-dark"}>{filter.value}</span>
                        <CloseButton className={"bg-edge hover:bg-edge"}
                                     onClick={() => {
                                        setFilters(filters.filter(f => f !== filter));
                                     }}
                        />
                    </div>
                ))}
            </div>

            {
                <>
                    {isOpen &&
                        <ContextMenu className={"fixed text-xs w-max py-1 shadow-2xl z-50"} ref={menuRef} >
                            {items.map((item, index) => (
                                <ContextMenuItem key={index}
                                                 title={item.name}
                                                 onClick={() => {
                                                     setOpen(false);
                                                     setOpenMenu(item);
                                                 }}
                                />
                            ))}
                        </ContextMenu>
                    }

                    {openMenu &&
                        <ContextMenu className={"fixed text-xs w-max py-1 shadow-2xl z-50"} ref={menuRef}>
                            {openMenu.values.map((value, index) => (
                                <ContextMenuItem key={index}
                                                 title={value}
                                                 onClick={() => {
                                                     setOpenMenu(null);
                                                     setFilters([...(filters || []), {name: openMenu.name, value: value}]);
                                                 }}
                                />
                            ))}
                        </ContextMenu>
                    }
                </>
            }

        </div>
    );
}

export { Filter };



