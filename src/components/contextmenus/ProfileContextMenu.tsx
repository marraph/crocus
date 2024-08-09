"use client";

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
        <div className={"space-y-2 px-4 pt-4"} ref={menuRef}>
            {showProfile &&
                <div className={"flex flex-col space-y-1 py-1 bg-black-light border border-edge rounded-lg"}>
                    <div className={"flex flex-row items-center space-x-2 px-3 py-2 mx-1 text-sm text-gray rounded-lg hover:bg-dark-light hover:text-white cursor-pointer"}>
                        <Briefcase size={18}/>
                        <span>My organisation</span>
                    </div>
                    <div className={"flex flex-row items-center space-x-2 px-3 py-2 mx-1 text-sm text-gray rounded-lg hover:bg-dark-light hover:text-white cursor-pointer"}>
                        <Settings size={18}/>
                        <span>Settings</span>
                    </div>
                    <Seperator/>
                    <div className={"flex flex-row items-center space-x-2 px-3 py-2 mx-1 text-sm rounded-lg red-button-style hover:red-button-style cursor-pointer"}>
                        <LogOut size={18}/>
                        <span>Log out</span>
                    </div>
                </div>
            }
            <div className={cn("group w-64 flex flex-row items-center justify-between cursor-pointer bg-black-light border border-edge rounded-lg hover:bg-dark-light")}
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