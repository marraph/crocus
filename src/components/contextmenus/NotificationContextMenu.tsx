"use client";

import React, {useState} from "react";
import {useUser} from "@/context/UserContext";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {Notification} from "@/components/Notification";
import {Bell} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";

interface ContextProps extends React.HTMLAttributes<HTMLDivElement> {
    notifications: { sender: string, task: string, date: Date, type: string}[];
}

export const NotificationContextMenu = React.forwardRef<HTMLDivElement, ContextProps>(({notifications, className, ...props}, ref) => {
    const [showMenu, setShowMenu] = useState(false);
    const {data, isLoading, error} = useUser();

    const menuRef = useOutsideClick(() => {
        setShowMenu(false);
    });

    return (
        <div className={"relative space-y-2"} ref={menuRef}>
            <Button text={""}
                    onClick={() => setShowMenu(!showMenu)}
                    icon={<Bell size={16}/>}
            />

            {showMenu &&
                <div className={"absolute right-0 bg-black rounded-lg py-1 border border-edge overflow-y-scroll no-scrollbar h-[300px] w-max z-50"}>
                    {notifications.map((n, index) => (
                        <Notification key={index} sender={n.sender} task={n.task} date={n.date} type={n.type} unread={true}/>
                    ))}
                </div>
            }
        </div>
    );
});
NotificationContextMenu.displayName = "NotificationContextMenu";