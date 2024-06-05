import {TaskCard} from "@/components/cards/TaskCard";
import React, {useEffect, useState} from "react";
import {TaskContextMenu} from "@/components/contextmenus/TaskContextMenu";
import {TaskElement} from "@/app/tasks/page";
import {formatDate} from "@/utils/format";


interface TaskProps {
    taskElements: TaskElement[];
}

export const TaskCardView: React.FC<TaskProps> = ({ taskElements }) => {
    const [contextMenu, setContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });

    useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false});
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
        e.preventDefault();
        setContextMenu({ id, x: e.clientX, y: e.clientY, visible: true });
    };

    return (
        <>
            {contextMenu.visible &&
                <TaskContextMenu taskId={contextMenu.id} x={contextMenu.x} y={contextMenu.y}/>
            }
            <div className={"grid grid-cols-5 gap-9 pt-4"}>
                {taskElements.map((taskElement, index) => (
                    <TaskCard key={index}
                              _id={taskElement.task.id}
                              title={taskElement.task.name}
                              topic={taskElement.task.topic.title}
                              priority={taskElement.task.priority}
                              team={taskElement.team.name}
                              project={taskElement.project.name}
                              status={taskElement.task.status}
                              createdAt={formatDate(taskElement.task.createdDate.toString())}
                              createdBy={taskElement.task.createdBy.name}
                              dueDate={formatDate(taskElement.task.deadline.toString())}
                              onContextMenu={(event) => handleContextMenu(event, taskElement.task.id)}/>
                ))}
            </div>
        </>

    );
}