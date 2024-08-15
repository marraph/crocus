"use client";

import React, {useState} from "react";
import {useUser} from "@/context/UserContext";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {Notification} from "@/components/Notification";
import {Bell} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {CustomScroll} from "react-custom-scroll";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";

interface ContextProps extends React.HTMLAttributes<HTMLDivElement> {
    notifications: { sender: string, task: string, date: Date, type: string}[];
}

export const NotificationContextMenu = React.forwardRef<HTMLDivElement, ContextProps>(({notifications, className, ...props}, ref) => {
    const [showMenu, setShowMenu] = useState(false);
    const {addTooltip, removeTooltip} = useTooltip();
    const {data, isLoading, error} = useUser();

    const menuRef = useOutsideClick(() => {
        setShowMenu(false);
    });

    return (
        <div className={"relative space-y-2"} ref={menuRef}>
            <Button text={""}
                    onClick={() => setShowMenu(!showMenu)}
                    icon={<Bell size={16}/>}
                    className={"px-2"}
                    onMouseEnter={(e) => {
                        addTooltip({
                            message: "View your notifications",
                            anchor: "br",
                            trigger: e.currentTarget.getBoundingClientRect()
                        });
                    }}
                    onMouseLeave={() => removeTooltip()}
            />

            {showMenu &&
                <div className={"absolute z-50 h-max w-max right-0 bg-black-light rounded-lg overflow-hidden border border-edge"}>
                    <CustomScroll>
                        <div className={"h-[300px] py-1"}>
                            {notifications.map((n, index) => (
                                <Notification key={index} sender={n.sender} task={n.task} date={n.date} type={n.type} unread={true}/>
                            ))}
                        </div>
                    </CustomScroll>
                </div>
            }
        </div>
    );
});
NotificationContextMenu.displayName = "NotificationContextMenu";