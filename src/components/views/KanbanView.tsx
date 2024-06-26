import React, {useEffect, useState} from "react";
import {TaskContextMenu} from "@/components/contextmenus/TaskContextMenu";
import {TaskElement} from "@/types/types";
import {DeleteTaskDialog} from "@/components/dialogs/tasks/DeleteTaskDialog";
import {CloseTaskDialog} from "@/components/dialogs/tasks/CloseTaskDialog";
import {EditTaskDialog} from "@/components/dialogs/tasks/EditTaskDialog";
import {KanbanCard} from "@/components/cards/KanbanCard";

interface TaskProps {
    taskElements: TaskElement[];
}

export const KanbanView: React.FC<TaskProps> = ({ taskElements }) => {
    const deleteRef = React.useRef<HTMLDialogElement>(null);
    const editRef = React.useRef<HTMLDialogElement>(null);
    const closeRef = React.useRef<HTMLDialogElement>(null);
    const [contextMenu, setContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [focusTaskElement, setFocusTaskElement] = useState<TaskElement | null>(null);

    const status = ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"];


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

            <div className={"grid grid-cols-5 gap-9 pt-4"}>
                {status.map((status) => (
                    <KanbanCard key={status} taskElements={taskElements} status={status}/>
                ))}
            </div>
        </>

    );
}