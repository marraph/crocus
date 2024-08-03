"use client";

import {ContextMenu, ContextMenuContainer, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
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
        <div className={"space-y-2"} ref={menuRef}>
            {showProfile &&
                <ContextMenu>
                    <ContextMenuContainer>
                        <ContextMenuItem title={"My organisation"} icon={<Briefcase size={18}/>}/>
                        <ContextMenuItem title={"Settings"} icon={<Settings size={18}/>}/>
                    </ContextMenuContainer>
                    <Seperator/>
                    <ContextMenuContainer>
                        <ContextMenuItem className={"red-button-style hover:red-button-style"}
                                         title={"Log out"} icon={<LogOut size={18}/>}/>
                    </ContextMenuContainer>
                </ContextMenu>
            }
            <div className={cn("group w-64 flex flex-row items-center justify-between cursor-pointer bg-black rounded-lg border border-edge hover:bg-dark")}
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
                    <div className={cn("flex flex-col items-start overflow-hidden")}>
                        <span className={"text-sm truncate w-full"}>{data?.name}</span>
                        <span className={cn("text-gray text-xs truncate w-full")}>{data?.teams[0].organisation.name}</span>
                    </div>
                </div>
                }

                <ChevronsUpDown className={cn("m-4 text-gray group-hover:text-white")}></ChevronsUpDown>
            </div>
        </div>
    );
});
ProfileContextMenu.displayName = "ProfileContextMenu";