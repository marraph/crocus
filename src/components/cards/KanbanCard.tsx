import React, {useEffect, useState} from "react";
import {Status, TaskElement} from "@/types/types";
import {TaskCard} from "@/components/cards/TaskCard";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {DeleteTaskDialog} from "@/components/dialogs/tasks/DeleteTaskDialog";
import {CloseTaskDialog} from "@/components/dialogs/tasks/CloseTaskDialog";
import {EditTaskDialog} from "@/components/dialogs/tasks/EditTaskDialog";
import {TaskContextMenu} from "@/components/contextmenus/TaskContextMenu";

interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
    taskElements: TaskElement[];
    status: Status;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ taskElements, status, className }) => {
    const deleteRef = React.useRef<HTMLDialogElement>(null);
    const editRef = React.useRef<HTMLDialogElement>(null);
    const closeRef = React.useRef<HTMLDialogElement>(null);
    const [contextMenu, setContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [focusTaskElement, setFocusTaskElement] = useState<TaskElement | null>(null);

    useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false});
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>, taskElement: TaskElement) => {
        e.preventDefault();
        setFocusTaskElement(taskElement);
        setContextMenu({ id: taskElement.id, x: e.clientX, y: e.clientY, visible: true });
    };

    return (
        <>
            {focusTaskElement &&
                <>
                    <DeleteTaskDialog ref={deleteRef} taskElement={focusTaskElement} buttonTrigger={false}/>
                    <CloseTaskDialog ref={closeRef} taskElement={focusTaskElement} buttonTrigger={false}/>
                    <EditTaskDialog ref={editRef} taskElement={focusTaskElement} buttonTrigger={false}/>
                </>
            }

            {contextMenu.visible &&
                <TaskContextMenu taskId={contextMenu.id} x={contextMenu.x} y={contextMenu.y} deleteRef={deleteRef} editRef={editRef} closeRef={closeRef}/>
            }

            <div className={"overflow-hidden bg-badgegray border border-white border-opacity-20 rounded-lg flex flex-col justify-center p-4 space-y-4"}>
                <div>
                    <StatusBadge title={status}/>
                </div>
                {taskElements.map((task) => (
                    <TaskCard key={task.id}
                              taskElement={task}
                              onContextMenu={(e) => handleContextMenu(e, task)}/>
                ))}
            </div>
        </>
    );
}