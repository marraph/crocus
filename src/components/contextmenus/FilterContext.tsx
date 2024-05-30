import React, {useState} from "react";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {
    ContextMenu,
    ContextMenuIcon,
    ContextMenuItem,
} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {BarChart, Flame, Folder, ListFilter, Radio, User, Users} from "lucide-react";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";

const teams = ["Frontend", "Backend", "Design", "Management", "Marketing", "Support"];
const projects = ["ServerAPI", "ClientAPI", "Website", "App", "Database"];
const topics = ["bug", "feature", "task"];
const statuses = ["todo", "in progress", "done"];
const priorities = ["low", "medium", "high"];
const creators = ["mvriu5", "marraph", "johndoe", "janedoe"];


export function FilterContext() {
    const [filterList, setFilterList] = useState<string[]>([]);

    const [showFilter, setShowFilter] = useState(false);
    const [showTeam, setShowTeam] = useState(false);
    const [showProject, setShowProject] = useState(false);
    const [showTopic, setShowTopic] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [showPriority, setShowPriority] = useState(false);
    const [showCreator, setShowCreator] = useState(false);

    const [selectTeam, setSelectedTeam] = useState(false);
    const [selectProject, setSelectedProject] = useState(false);
    const [selectTopic, setSelectedTopic] = useState(false);
    const [selectStatus, setSelectedStatus] = useState(false);
    const [selectPriority, setSelectedPriority] = useState(false);
    const [selectCreator, setSelectedCreator] = useState(false);

    const menuRef = useOutsideClick(() => {
        setShowFilter(false);
        closeMenus();
    });

    const closeMenus = () => {
        setShowTeam(false);
        setShowProject(false);
        setShowTopic(false);
        setShowStatus(false);
        setShowPriority(false);
        setShowCreator(false);
    }

    const addFilterToList = (filter: string) => {
        setFilterList((prevList) => [...prevList, filter]);
    };

    const deleteFilter = () => {
        setFilterList([]);
        closeMenus();
    }

    return (
        <div className={"relative space-y-2 pb-8"} ref={menuRef}>
            <button className={filterList.length <= 0 ?
                "group w-min h-8 flex flex-row items-center space-x-2 bg-black rounded-lg border border-white border-opacity-20 text-sm font-normal text-gray " +
                "hover:text-white hover:bg-dark py-2 px-4" :
                "group w-min h-8 flex flex-row items-center space-x-2 bg-black rounded-lg border border-white border-opacity-20 text-sm font-normal text-gray " +
                "hover:text-white hover:bg-dark py-2 pl-4 pr-1"
            }
                    onClick={() => {setShowFilter(!showFilter); closeMenus();}}>
                <ListFilter size={20} className={"mr-2"}/>
                {filterList.length <= 0 ? "Filter" : `${filterList.length} Filter`}
                {filterList.length > 0 &&
                    <CloseButton className={"bg-black group-hover:bg-dark"} onClick={(e) => {e.stopPropagation(); deleteFilter();}}/>}
            </button>
            <div className={"absolute top-full right-0"}>
                {showFilter &&
                    <ContextMenu checkmarkOn={false} className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        <ContextMenuItem title={"Team"} onClick={() => {setShowFilter(!showFilter); setShowTeam(!showTeam);}}>
                            <ContextMenuIcon icon={<Users size={18}/>}/>
                        </ContextMenuItem>
                        <ContextMenuItem title={"Project"} onClick={() => {setShowFilter(!showFilter); setShowProject(!showProject);}}>
                            <ContextMenuIcon icon={<Folder size={18}/>}/>
                        </ContextMenuItem>
                        <ContextMenuItem title={"Topic"} onClick={() => {setShowFilter(!showFilter); setShowTopic(!showTopic);}}>
                            <ContextMenuIcon icon={<Flame size={18}/>}/>
                        </ContextMenuItem>
                        <ContextMenuItem title={"Status"} onClick={() => {setShowFilter(!showFilter); setShowStatus(!showStatus);}}>
                            <ContextMenuIcon icon={<Radio size={18}/>}/>
                        </ContextMenuItem>
                        <ContextMenuItem title={"Priority"} onClick={() => {setShowFilter(!showFilter); setShowPriority(!showPriority);}}>
                            <ContextMenuIcon icon={<BarChart size={18}/>}/>
                        </ContextMenuItem>
                        <ContextMenuItem title={"Creator"} onClick={() => {setShowFilter(!showFilter); setShowCreator(!showCreator);}}>
                            <ContextMenuIcon icon={<User size={18}/>}/>
                        </ContextMenuItem>
                    </ContextMenu>
                }
                {showTeam &&
                    <ContextMenu checkmarkOn={true} className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {teams.map((team) => (
                            <ContextMenuItem key={team} title={team} onClick={() => {closeMenus(); addFilterToList(team); setSelectedTeam(true);}}/>
                        ))}
                    </ContextMenu>
                }
                {showProject &&
                    <ContextMenu checkmarkOn={true} className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {projects.map((project) => (
                            <ContextMenuItem key={project} title={project} onClick={() => {closeMenus(); addFilterToList(project); setSelectedProject(true);}}/>
                        ))}
                    </ContextMenu>
                }
                {showTopic &&
                    <ContextMenu checkmarkOn={true} className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {topics.map((topic) => (
                            <ContextMenuItem key={topic} title={topic} onClick={() => {closeMenus(); addFilterToList(topic); setSelectedTopic(true);}}/>
                        ))}
                    </ContextMenu>
                }
                {showStatus &&
                    <ContextMenu checkmarkOn={true} className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {statuses.map((status) => (
                            <ContextMenuItem key={status} title={status} onClick={() => {closeMenus(); addFilterToList(status); setSelectedStatus(true);}}/>
                        ))}
                    </ContextMenu>
                }
                {showPriority &&
                    <ContextMenu checkmarkOn={true} className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {priorities.map((priority) => (
                            <ContextMenuItem key={priority} title={priority} onClick={() => {closeMenus(); addFilterToList(priority); setSelectedPriority(true);}}/>
                        ))}
                    </ContextMenu>
                }
                {showCreator &&
                    <ContextMenu checkmarkOn={true} className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {creators.map((creator) => (
                            <ContextMenuItem key={creator} title={creator} onClick={() => {closeMenus(); addFilterToList(creator); setSelectedCreator(true);}}/>
                        ))}
                    </ContextMenu>
                }
            </div>
        </div>
    );
}