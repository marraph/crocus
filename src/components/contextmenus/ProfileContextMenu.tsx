"use client";

import {ContextMenu, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import React, {useState} from "react";
import {Briefcase, ChevronsUpDown, LogOut, Settings} from "lucide-react";
import {cn} from "@/utils/cn";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {Skeleton, SkeletonColumn, SkeletonElement} from "@marraph/daisy/components/skeleton/Skeleton";
import {useUser} from "@/context/UserContext";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";

const path = "/image.png";

export const ProfileContextMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => {
    const [showProfile, setShowProfile] = useState(false);
    const {data, isLoading, error} = useUser();

    const menuRef = useOutsideClick(() => {
        setShowProfile(false);
    });

    if (error) return <div>Error: {error}</div>;


    return (
        <div className={"space-y-2 pb-8"} ref={menuRef}>
            {showProfile &&
                <ContextMenu className={cn("font-normal text-sm")}>
                    <ContextMenuItem title={"My organisation"} className={"mx-2"} icon={<Briefcase size={18}/>}/>
                    <ContextMenuItem title={"Settings"} className={"mx-2 mb-2"} icon={<Settings size={18}/>}/>
                    <Seperator/>
                    <ContextMenuItem className={"text-lightred hover:text-lightred hover:bg-lightred hover:bg-opacity-10 mx-2 mt-2"}
                                     title={"Log out"} icon={<LogOut size={18}/>}/>
                </ContextMenu>
            }
            <div className={cn("group flex flex-row items-center justify-between cursor-pointer bg-black rounded-lg border border-white border-opacity-20 hover:bg-selected")}
                onClick={() => setShowProfile(!showProfile)}>

                {isLoading ?
                <Skeleton className={"w-max"}>
                    <SkeletonElement className={"m-2"} width={43} height={43}/>
                    <SkeletonColumn className={"items-start space-y-2 mr-0"}>
                        <SkeletonElement width={110} height={10}/>
                        <SkeletonElement width={80} height={10}/>
                    </SkeletonColumn>
                </Skeleton>
                    :
                <div className={cn("flex flex-row items-center space-x-2")}>
                    <Avatar className={cn("p-2")} img_url={path} size={60} shape={"box"}></Avatar>
                    <div className={cn("flex flex-col items-start")}>
                        <span className={"text-sm"}>{data?.name}</span>
                        <span className={cn("text-gray text-xs")}>{data?.teams[0].organisation.name}</span>
                    </div>
                </div>
                }

                <ChevronsUpDown className={cn("m-4 text-gray group-hover:text-white")}></ChevronsUpDown>
            </div>
        </div>
    );
});
ProfileContextMenu.displayName = "ProfileContextMenu";