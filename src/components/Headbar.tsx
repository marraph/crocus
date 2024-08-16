"use client";

import {Search} from "lucide-react";
import {Shortcut} from "@marraph/daisy/components/shortcut/Shortcut";
import React, {HTMLAttributes, useRef} from "react";
import {SearchDialog} from "@/components/dialogs/SearchDialog";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {NotificationContextMenu} from "@/components/contextmenus/NotificationContextMenu";
import {cn} from "@/utils/cn";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {useHotkeys} from "react-hotkeys-hook";

interface HeadbarProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
}

export const Headbar: React.FC<HeadbarProps> = ({ title, className, ...props }) => {
    const searchDialogRef = useRef<DialogRef>(null);
    const { addTooltip, removeTooltip } = useTooltip();
    useHotkeys('mod+k', () => searchDialogRef.current?.showModal(), { preventDefault: true });


    const notifications = [
        { sender: "John Doe", task: "Task 1", date: new Date("2024-06-29T08:00:00"), type: "message" },
        { sender: "Jane Doe", task: "Task 2", date: new Date("2024-06-28T14:30:00"), type: "change" },
        { sender: "John Doe", task: "Task 3", date: new Date("2024-06-27T09:45:00"), type: "message" },
        { sender: "Jane Doe", task: "Task 4", date: new Date("2024-06-26T11:15:00"), type: "change" },
        { sender: "John Doe", task: "Task 5", date: new Date("2024-06-25T16:50:00"), type: "message" },
        { sender: "Jane Doe", task: "Task 6", date: new Date("2024-06-24T13:20:00"), type: "change" },
        { sender: "John Doe", task: "Task 7", date: new Date("2024-06-23T10:05:00"), type: "message" },
        { sender: "Jane Doe", task: "Task 8", date: new Date("2024-06-22T15:40:00"), type: "change" },
        { sender: "John Doe", task: "Task 9", date: new Date("2024-06-21T08:25:00"), type: "message" },
        { sender: "Jane Doe", task: "Task 10", date: new Date("2024-06-20T14:10:00"), type: "change" },
    ];

    return (
        <>
            <SearchDialog ref={searchDialogRef}/>

            <div className={cn("w-full flex flex-row items-center justify-between p-4 border-b border-edge", className)}>
                {title && <span className={"text-xl font-normal"}>{title}</span>}
                {props.children}
                <div className={"flex flex-row space-x-4 items-center"}>
                    <div className={"h-8 w-56 group flex flex-row justify-between items-center rounded-lg bg-black-light border border-edge cursor-pointer pr-1"}
                         onClick={() => searchDialogRef.current?.showModal()}
                         onMouseEnter={(e) => {
                             addTooltip({
                                 message: "Search your workspace",
                                 anchor: "br",
                                 trigger: e.currentTarget.getBoundingClientRect()
                             });
                         }}
                         onMouseLeave={() => removeTooltip()}
                    >
                        <div className={"flex flex-row items-center text-marcador text-sm space-x-2"}>
                            <Search size={18} className={"group-focus:text-white ml-2"}/>
                            <span>{"Search"}</span>
                        </div>
                        <Shortcut text={"⌘ K"}/>
                    </div>
                    <NotificationContextMenu notifications={notifications}/>
                </div>
            </div>
        </>
    );
}
