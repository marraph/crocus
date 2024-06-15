import {TaskCard} from "@/components/cards/TaskCard";
import React, {useEffect, useState} from "react";
import {TaskContextMenu} from "@/components/contextmenus/TaskContextMenu";
import {formatDate} from "@/utils/format";
import {TaskElement} from "@/types/types";
import {DeleteTaskDialog} from "@/components/dialogs/DeleteTaskDialog";
import {CloseTaskDialog} from "@/components/dialogs/CloseTaskDialog";
import {EditTaskDialog} from "@/components/dialogs/EditTaskDialog";

interface TaskProps {
    taskElements: TaskElement[];
}

export const TaskCardView: React.FC<TaskProps> = ({ taskElements }) => {
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

            <div className={"grid grid-cols-3 gap-9 pt-4"}>
                {taskElements.map((taskElement, index) => (
                    <TaskCard key={index}
                              _id={taskElement.id}
                              title={taskElement.name}
                              topic={taskElement.topic?.title}
                              priority={taskElement.priority?.toString()}
                              team={taskElement.team?.name}
                              project={taskElement.project?.name}
                              status={taskElement.status?.toString()}
                              createdAt={formatDate(taskElement.createdDate.toString())}
                              createdBy={taskElement.createdBy.name}
                              dueDate={formatDate(taskElement.deadline?.toString())}
                              onContextMenu={(event) => handleContextMenu(event, taskElement)}/>
                ))}
            </div>
        </>

    );
}