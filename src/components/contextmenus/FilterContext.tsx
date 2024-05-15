import React, {useState} from "react";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {
    ContextMenu,
    ContextMenuIcon,
    ContextMenuItem,
} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Briefcase, ListFilter, LogOut, Settings} from "lucide-react";
import {Button, ButtonIcon} from "@marraph/daisy/components/button/Button";

export function FilterContext() {
    const [showFilter, setShowFilter] = useState(false);

    const menuRef = useOutsideClick(() => {
        setShowFilter(false);
    });

    return (
        <div className={"relative space-y-2 pb-8"} ref={menuRef}>
            <Button text={"Filter"} className={"w-min h-8"} size={"small"} onClick={() => setShowFilter(!showFilter)}>
                <ButtonIcon icon={<ListFilter size={20}/>}/>
            </Button>
            {showFilter &&
                <ContextMenu className={"w-max font-normal text-sm absolute top-full translate-x-[-45%]"}>
                    <ContextMenuItem title={"My organisation"} className={"mx-2"}>
                        <ContextMenuIcon icon={<Briefcase size={18}/>}/>
                    </ContextMenuItem>
                    <ContextMenuItem title={"Settings"} className={"mx-2"}>
                        <ContextMenuIcon icon={<Settings size={18}/>}/>
                    </ContextMenuItem>
                </ContextMenu>
            }
        </div>
    );
}