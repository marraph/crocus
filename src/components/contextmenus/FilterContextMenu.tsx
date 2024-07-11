import {
    Filter,
    FilterButton,
    FilterItem,
    FilterRef,
    getFilterFromCache,
    putFilterInCache
} from "@marraph/daisy/components/filter/Filter";
import {Box, CircleAlert, LineChart, Tag, User, Users} from "lucide-react";
import React, {forwardRef, useMemo, useState} from "react";
import {useUser} from "@/context/UserContext";
import {getAllCreators, getAllTeams, getAllTopics, getProjects} from "@/utils/getTypes";

interface FilterContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    onClick?: () => void;
    onChange?: () => void;
}

export const FilterContextMenu = forwardRef<FilterRef, FilterContextMenuProps>(({onClick, onChange, className, ...props}, ref) => {
    const [team, setTeam] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filter[]>(getFilterFromCache(sessionStorage));
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const statuses = useMemo(() => ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"], []);
    const priorities = useMemo(() => ["LOW", "MEDIUM", "HIGH"], []);

    if (user === undefined) return;
    console.log(filters);

    const handleFilterChange = (newFilter: Filter | null) => {
        if (onChange) onChange();
        if (!newFilter) return;

        const newFilterList = putFilterInCache(sessionStorage, filters, newFilter?.key, newFilter?.value ?? null)
        setFilters(newFilterList);
        sessionStorage.setItem('filters', JSON.stringify(filters));

        if (filters.some(filter => filter.key === "Team")) {
            setTeam(filters.find(filter => filter.key === "Team")?.value ?? null);
        } else {
            setTeam(null);
        }
    }

    return (
        <FilterButton onFilterChange={(filter) => handleFilterChange(filter)} onResetTeamSelected={() => setTeam(null)} ref={ref}>
            <FilterItem title={"Team"} data={getAllTeams(user)} onClick={onClick} icon={<Users size={16}/>}/>
            {team &&
                <>
                    <FilterItem title={"Project"} data={getProjects(user, team)} icon={<Box size={16}/>}/>
                    <FilterItem title={"Topic"} data={getAllTopics(user)} icon={<Tag size={16}/>}/>
                </>
            }
            <FilterItem title={"Status"} data={statuses} icon={<CircleAlert size={16}/>}/>
            <FilterItem title={"Priority"} data={priorities} icon={<LineChart size={16}/>}/>
            <FilterItem title={"Creator"} data={getAllCreators(user)} icon={<User size={16}/>}/>
        </FilterButton>
    );
});
FilterContextMenu.displayName = "FilterContextMenu";