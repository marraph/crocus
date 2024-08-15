"use client";

import React, {
    forwardRef,
    HTMLAttributes,
    ReactNode,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState
} from "react";
import {ContextMenu, ContextMenuContainer, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Button} from "@marraph/daisy/components/button/Button";
import {
    Box,
    Check,
    CircleAlert,
    LineChart,
    ListFilter,
    Search, SignalHigh,
    SignalLow,
    SignalMedium,
    Tag,
    Users
} from "lucide-react";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {TaskElement} from "@/types/types";
import {cn} from "@/utils/cn";
import {CustomScroll} from "react-custom-scroll";
import {Input} from "@marraph/daisy/components/input/Input";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";

type FilterItem = {
    name: string;
    values: string[];
    icon: ReactNode;
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
    const [searchTerm, setSearchTerm] = useState("");
    const { addTooltip, removeTooltip } = useTooltip();

    const saveFilters = (filters: SelectedFilter[]) => {
        sessionStorage.setItem('taskFilters', JSON.stringify(filters));
    };

    const getStoredFilters = (): SelectedFilter[] | null => {
        if (typeof window !== 'undefined') {
            const storedFilters = sessionStorage.getItem('taskFilters');
            return storedFilters ? JSON.parse(storedFilters) : null;
        }
        return null;
    };

    useEffect(() => {
        const storedFilters = getStoredFilters();
        if (storedFilters) {
            setFilters(storedFilters);
        }
    }, []);


    const menuRef = useOutsideClick(() => {
        setMenuOpen(false);
        setSubMenuOpen(null);
        setSearchTerm("");
    });

    const handleMenuClick = (item: FilterItem) => {
        setSubMenuOpen(item);
    }

    const handleSubMenuClick = (value: string) => {
        if (subMenuOpen) {
            const newFilter = { name: subMenuOpen.name as keyof TaskElement, value: value };
            if (filters.some(f => f.name === newFilter.name && f.value === newFilter.value)) {
                const updatedFilters = filters.filter(f => f.name !== newFilter.name || f.value !== newFilter.value);
                setFilters(updatedFilters);
                saveFilters(updatedFilters);
            } else {
                const updatedFilters = filters.filter(f => f.name !== newFilter.name);
                setFilters([...updatedFilters, newFilter]);
                saveFilters([...updatedFilters, newFilter]);
            }
            onChange();
        }
        console.log(filters)
        setSubMenuOpen(null);
        setMenuOpen(false);
        setSearchTerm("");
    }

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const filteredValues = useMemo(() => {
        if (!subMenuOpen) return [];
        const uniqueValues = new Set(subMenuOpen.values);

        return Array.from(uniqueValues).filter(value =>
            value.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [subMenuOpen, searchTerm]);

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
                            setSearchTerm("");
                        }}
                        onMouseEnter={(e) => {
                            addTooltip({
                                message: "Filter your tasks",
                                anchor: "tl",
                                trigger: e.currentTarget.getBoundingClientRect()
                            });
                        }}
                        onMouseLeave={() => removeTooltip()}
                />
                {filters && filters.map((filter, index) => (
                    <FilterBadge
                        key={index}
                        name={filter.name}
                        value={filter.value}
                        onClick={() => {
                            setFilters(filters.filter(f => f !== filter));
                            saveFilters(filters.filter(f => f !== filter));
                            onChange();
                        }}
                    />
                ))}
            </div>

            {menuOpen && !subMenuOpen &&
                <div className={"absolute z-50 bg-black-light border border-edge rounded-lg text-sm text-gray p-1 space-y-1 shadow-2xl"}>
                    {items.map((item, index) => (
                        <div className={"flex flex-row items-center space-x-2 px-2 py-1 rounded-lg hover:bg-dark-light hover:text-white cursor-pointer"}
                            key={index}
                            onClick={() => handleMenuClick(item)}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            }

            {subMenuOpen &&
                <div className={"absolute z-50 max-h-48 w-max flex flex-col bg-black-light rounded-lg border border-edge overflow-hidden shadow-2xl"}>
                    <div className={"w-full flex flex-row items-center space-x-2 py-1 border-b border-edge rounded-t-lg"}>
                        <Search size={16} className={"text-gray ml-2"}/>
                        <input placeholder={"Search"}
                               value={searchTerm}
                               onChange={handleInputChange}
                               className={"w-full bg-black-light text-white-dark p-1 focus:outline-0 placeholder-marcador text-sm"}
                        />
                    </div>
                    {filteredValues.length === 0 &&
                        <div className={"text-center text-sm text-marcador pt-2"}>
                            No results found
                        </div>
                    }
                    {filteredValues.length > 4 ?
                        <CustomScroll>
                            <div className={"max-h-[150px] flex flex-col text-sm text-gray p-1 space-y-1"}>
                                {filteredValues.map((value, index) => (
                                    <div className={cn("flex flex-row space-x-2 items-center px-2 py-1 rounded-lg hover:bg-dark-light hover:text-white cursor-pointer",
                                        { "bg-dark-light text-white": filters.some(f => f.name === subMenuOpen.name && f.value === value) })}
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
                        </CustomScroll>
                        :
                        <div className={"flex flex-col text-sm text-gray p-1 space-y-1"}>
                            {filteredValues.map((value, index) => (
                                <div className={cn("flex flex-row space-x-2 items-center px-2 py-1 rounded-lg hover:bg-dark hover:text-white cursor-pointer",
                                    { "bg-dark text-white": filters.some(f => f.name === subMenuOpen.name && f.value === value) })}
                                     key={index}
                                     onClick={() => handleSubMenuClick(value)}
                                >
                                    {filters.some(f => f.name === subMenuOpen.name && f.value === value) &&
                                        <Check size={16}/>
                                    }
                                    {subMenuOpen.name === "Status" &&
                                        value === "PENDING" &&
                                        <div className={"size-1 rounded-full bg-topicblue"}/> ||
                                        value === "PLANING" &&
                                        <div className={"size-1 rounded-full bg-topicred"}/> ||
                                        value === "STARTED" &&
                                        <div className={"size-1 rounded-full bg-topicgreen"}/> ||
                                        value === "TESTED" &&
                                        <div className={"size-1 rounded-full bg-topicyellow"}/> ||
                                        value === "FINISHED" &&
                                        <div className={"size-1 rounded-full bg-topicpurple"}/>
                                    }
                                    {subMenuOpen.name === "Priority" &&
                                        value === "LOW" &&
                                        <SignalLow strokeWidth={3} size={16}/> ||
                                        value === "MEDIUM" &&
                                        <SignalMedium strokeWidth={3} size={16}/> ||
                                        value === "HIGH" &&
                                        <SignalHigh strokeWidth={3} size={16}/>
                                    }
                                    <span>{value}</span>
                                </div>
                            ))}
                        </div>
                    }
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



