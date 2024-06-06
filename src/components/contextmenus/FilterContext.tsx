import {Filter, FilterItem, FilterRef} from "@marraph/daisy/components/filter/Filter";
import {BookCopy, LineChart, SmartphoneCharging, Tag, User, Users} from "lucide-react";
import {useRef, useState} from "react";
import {useUser} from "@/context/UserContext";
import {Project, Team} from "@/types/types";

export function FilterContext() {
    const filterRef = useRef<FilterRef>(null);

    const [teamSelected, setTeamSelected] = useState({isSelected: false, team: ""});
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});

    const handleFilterChange = (filters: { [key: string]: string | null }) => {
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
                    if (task.topic) {
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
                    creators.push(task.createdBy.name);
                });
            });
        });
        return creators;
    }

    const status = ["Pending", "Planing", "Started", "Tested", "Finished", "Archived"];

    const priorities = ["LOW", "MEDIUM", "HIGH"];

    return (
        <Filter ref={filterRef} onFilterChange={handleFilterChange} onResetTeamSelected={resetTeamSelected}>
            <FilterItem title={"Team"} data={getTeams()} icon={<Users size={16}/>}></FilterItem>
            {teamSelected.isSelected &&
                <FilterItem title={"Project"} data={getProjects(teamSelected.team)} icon={<BookCopy size={16}/>}></FilterItem>
            }
            <FilterItem title={"Topic"} data={getTopics()} icon={<Tag size={16}/>}></FilterItem>
            <FilterItem title={"Status"} data={status} icon={<SmartphoneCharging size={16}/>}></FilterItem>
            <FilterItem title={"Priority"} data={priorities} icon={<LineChart size={16}/>}></FilterItem>
            <FilterItem title={"Creator"} data={getCreators()} icon={<User size={16}/>}></FilterItem>
        </Filter>
    );
}