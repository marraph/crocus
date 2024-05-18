import {ContextMenu, ContextMenuIcon, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Pencil, Trash2} from "lucide-react";
import React from "react";

interface TaskContextProps extends React.HTMLAttributes<HTMLDivElement> {
    x: number;
    y: number;
}

export const TaskContext: React.FC<TaskContextProps> = ({ x, y, className, ...props }, ref) => {
    return (
        <ContextMenu className={"top-{y} left-{x}"} ref={ref} {...props}>
            <ContextMenuItem title={"Edit"}>
                <ContextMenuIcon icon={<Pencil size={16}/>}/>
            </ContextMenuItem>
            <ContextMenuItem title={"Delete"}>
                <ContextMenuIcon icon={<Trash2 size={16}/>}/>
            </ContextMenuItem>
        </ContextMenu>
    )
}