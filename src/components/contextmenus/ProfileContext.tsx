"use client";

import {ContextMenu, ContextMenuIcon, ContextMenuItem, ContextMenuSeperator} from "@marraph/daisy/components/contextmenu/ContextMenu";
import React, {useState} from "react";
import {Briefcase, ChevronsUpDown, LogOut, Settings} from "lucide-react";
import {cn} from "@/utils/cn";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {useUser} from "@/context/UserContext";
import {useOrganisation} from "@/context/OrganisationContext";
import {Skeleton, SkeletonColumn, SkeletonElement} from "@marraph/daisy/components/skeleton/Skeleton";

const path = "/image.png";

export function ProfileContext() {
    const [showProfile, setShowProfile] = useState(false);

    const { data:User, isLoading:userLoading, error:userError } = useUser();
    const { data:Organisation, isLoading:organisationLoading, error:organisationError } = useOrganisation();

    const menuRef = useOutsideClick(() => {
        setShowProfile(false);
    });

    if (userError)
        return <div>Fehler: {userError}</div>;

    if (organisationError)
        return <div>Fehler: {userError}</div>;

    return (
        <div className={"space-y-2 pb-8"} ref={menuRef}>
            {showProfile &&
                <ContextMenu className={cn("font-normal text-sm")}>
                    <ContextMenuItem title={"My organisation"} className={"mx-2"}>
                        <ContextMenuIcon icon={<Briefcase size={18}/>}/>
                    </ContextMenuItem>
                    <ContextMenuItem title={"Settings"} className={"mx-2 mb-2"}>
                        <ContextMenuIcon icon={<Settings size={18}/>}/>
                    </ContextMenuItem>
                    <ContextMenuSeperator/>
                    <ContextMenuItem title={"Log out"} className={"text-lightred hover:text-lightred " +
                        "hover:bg-lightred hover:bg-opacity-10 mx-2 mt-2"}>
                        <ContextMenuIcon icon={<LogOut size={18}/>}/>
                    </ContextMenuItem>
                </ContextMenu>
            }
            <div className={cn("group flex flex-row items-center justify-between cursor-pointer bg-black rounded-lg border border-white border-opacity-20 hover:bg-dark")}
                onClick={() => setShowProfile(!showProfile)}>
                <div className={cn("flex flex-row items-center space-x-2")}>

                    {userLoading || organisationLoading ?
                    <Skeleton className={"bg-dark"}>
                        <SkeletonElement className={"p-2"} width={60} height={60}/>
                        <SkeletonColumn className={"items-start"}>
                            <SkeletonElement width={100} height={20}/>
                            <SkeletonElement width={100} height={20}/>
                        </SkeletonColumn>
                    </Skeleton>
                        :
                    <>
                        <Avatar className={cn("p-2")} img_url={path} size={60} shape={"box"}></Avatar>
                        <div className={cn("flex flex-col items-start")}>
                            <span className={"text-sm"}>{User?.name}</span>
                            <span className={cn("text-gray text-xs")}>{Organisation?.name}</span>
                        </div>
                    </>
                    }
                </div>
                <ChevronsUpDown className={cn("m-4 text-gray group-hover:text-white")}></ChevronsUpDown>
            </div>
        </div>
    );
}