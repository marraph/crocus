import React, {useState} from "react";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {
    ContextMenu,
    ContextMenuIcon,
    ContextMenuItem,
} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {BarChart, Flame, Folder, ListFilter, Radio, User, Users} from "lucide-react";
import {Button, ButtonIcon} from "@marraph/daisy/components/button/Button";

const teams = ["Frontend", "Backend", "Design", "Management", "Marketing", "Support"];
const projects = ["ServerAPI", "ClientAPI", "Website", "App", "Database"];
const topics = ["bug", "feature", "task"];
const statuses = ["todo", "in progress", "done"];
const priorities = ["low", "medium", "high"];
const creators = ["mvriu5", "marraph", "johndoe", "janedoe"];


export function FilterContext() {
    const [showFilter, setShowFilter] = useState(false);

    const [showTeam, setShowTeam] = useState(false);
    const [showProject, setShowProject] = useState(false);
    const [showTopic, setShowTopic] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [showPriority, setShowPriority] = useState(false);
    const [showCreator, setShowCreator] = useState(false);

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

    return (
        <div className={"relative space-y-2 pb-8"} ref={menuRef}>
            <Button text={"Filter"} className={"w-min h-8"} size={"small"} onClick={() => {setShowFilter(!showFilter); closeMenus()}}>
                <ButtonIcon icon={<ListFilter size={20}/>}/>
            </Button>
            <div className={"absolute top-full right-0"}>
                {showFilter &&
                    <ContextMenu className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        <ContextMenuItem title={"Team"} onClick={() => {setShowTeam(!showTeam); setShowFilter(!showFilter);}}>
                            <ContextMenuIcon icon={<Users size={18}/>}/>
                        </ContextMenuItem>
                        <ContextMenuItem title={"Project"} onClick={() => {setShowProject(!showProject); setShowFilter(!showFilter);}}>
                            <ContextMenuIcon icon={<Folder size={18}/>}/>
                        </ContextMenuItem>
                        <ContextMenuItem title={"Topic"} onClick={() => {setShowTopic(!showTopic); setShowFilter(!showFilter);}}>
                            <ContextMenuIcon icon={<Flame size={18}/>}/>
                        </ContextMenuItem>
                        <ContextMenuItem title={"Status"} onClick={() => {setShowStatus(!showStatus); setShowFilter(!showFilter);}}>
                            <ContextMenuIcon icon={<Radio size={18}/>}/>
                        </ContextMenuItem>
                        <ContextMenuItem title={"Priority"} onClick={() => {setShowPriority(!showPriority); setShowFilter(!showFilter);}}>
                            <ContextMenuIcon icon={<BarChart size={18}/>}/>
                        </ContextMenuItem>
                        <ContextMenuItem title={"Creator"} onClick={() => {setShowCreator(!showCreator); setShowFilter(!showFilter);}}>
                            <ContextMenuIcon icon={<User size={18}/>}/>
                        </ContextMenuItem>
                    </ContextMenu>
                }
                {showTeam &&
                    <ContextMenu className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {teams.map((team) => (
                            <ContextMenuItem key={team} title={team} onClick={() => closeMenus()}/>
                        ))}
                    </ContextMenu>
                }
                {showProject &&
                    <ContextMenu className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {projects.map((project) => (
                            <ContextMenuItem key={project} title={project} onClick={() => closeMenus()}/>
                        ))}
                    </ContextMenu>
                }
                {showTopic &&
                    <ContextMenu className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {topics.map((topic) => (
                            <ContextMenuItem key={topic} title={topic} onClick={() => closeMenus()}/>
                        ))}
                    </ContextMenu>
                }
                {showStatus &&
                    <ContextMenu className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {statuses.map((status) => (
                            <ContextMenuItem key={status} title={status} onClick={() => closeMenus()}/>
                        ))}
                    </ContextMenu>
                }
                {showPriority &&
                    <ContextMenu className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {priorities.map((priority) => (
                            <ContextMenuItem key={priority} title={priority} onClick={() => closeMenus()}/>
                        ))}
                    </ContextMenu>
                }
                {showCreator &&
                    <ContextMenu className={"w-max font-normal text-sm p-2 shadow-black shadow-2xl"}>
                        {creators.map((creator) => (
                            <ContextMenuItem key={creator} title={creator} onClick={() => closeMenus()}/>
                        ))}
                    </ContextMenu>
                }
            </div>
        </div>
    );
}