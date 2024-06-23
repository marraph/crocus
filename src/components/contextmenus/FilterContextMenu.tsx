import {FilterButton, FilterItem, FilterRef} from "@marraph/daisy/components/filter/Filter";
import {BookCopy, Box, CircleAlert, LineChart, Tag, User, Users} from "lucide-react";
import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {useUser} from "@/context/UserContext";
import {Project, Team} from "@/types/types";

interface FilterContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    onClick?: () => void;
    onChange?: () => void;
}

export const FilterContextMenu = forwardRef<FilterRef, FilterContextMenuProps>(({onClick, onChange, className, ...props}, ref) => {
    const [teamSelected, setTeamSelected] = useState({isSelected: false, team: ""});
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});

    const handleFilterChange = (filters: { [key: string]: string | null }) => {
        if (onChange) onChange();

        setSelectedFilters(filters);
        if (filters["Team"] !== null) {
            setTeamSelected({isSelected: true, team: filters["Team"] ?? ""});
        } else {
            setTeamSelected({isSelected: false, team: ""});
        }
    }

    const resetTeamSelected = () => {
        setTeamSelected({isSelected: false, team: ""});
    }

    const {data, isLoading, error} = useUser();

    const getTeams = () => {
        const teams: string[] = [];
        data?.teams.forEach((team: Team) => {
            teams.push(team.name);
        });
        return teams;
    }

    const getProjects = (teamToFind: string) => {
        const specificTeam = data?.teams.find((team: Team) => team.name === teamToFind);
        const projects: string[] = [];
        specificTeam?.projects.forEach((project: Project) => {
            projects.push(project.name);
        });
        return projects;
    }

    const getTopics = () => {
        const topics: string[] = [];
        data?.teams.forEach(team => {
            team.projects.forEach(project => {
                project.tasks.forEach(task => {
                    if (task.topic && !topics.includes(task.topic.title)) {
                        topics.push(task.topic.title);
                    }
                });
            });
        });
        return topics;
    }

    const getCreators = () => {
        const creators: string[] = [];
        data?.teams.forEach(team => {
            team.projects.forEach(project => {
                project.tasks.forEach(task => {
                    if (!creators.includes(task.createdBy.name))
                        creators.push(task.createdBy.name);
                });
            });
        });
        return creators;
    }

    const status = ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"];
    const priorities = ["LOW", "MEDIUM", "HIGH"];

    return (
        <FilterButton onFilterChange={handleFilterChange} onResetTeamSelected={resetTeamSelected} ref={ref}>
            <FilterItem title={"Team"} data={getTeams()} onClick={onClick} icon={<Users size={16}/>}/>
            {teamSelected.isSelected &&
                <FilterItem title={"Project"} data={getProjects(teamSelected.team)} icon={<Box size={16}/>}/>
            }
            <FilterItem title={"Topic"} data={getTopics()} icon={<Tag size={16}/>}/>
            <FilterItem title={"Status"} data={status} icon={<CircleAlert size={16}/>}/>
            <FilterItem title={"Priority"} data={priorities} icon={<LineChart size={16}/>}/>
            <FilterItem title={"Creator"} data={getCreators()} icon={<User size={16}/>}/>
        </FilterButton>
    );
});
FilterContextMenu.displayName = "FilterContextMenu";