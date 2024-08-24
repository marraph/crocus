"use client";

import React, {useRef, useState} from "react";
import {Briefcase, ChevronsUpDown, LogOut, Settings} from "lucide-react";
import {cn} from "@/utils/cn";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {useUser} from "@/context/UserContext";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {LogOutDialog} from "@/components/dialogs/LogOutDialog";
import {useRouter} from "next/navigation";
import {useOutsideClick} from "@marraph/daisy/hooks/useOutsideClick";
import {Skeleton, SkeletonColumn, SkeletonElement} from "@marraph/daisy/components/skeleton/Skeleton";

const path = "/image.png";

export const ProfileContextMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => {
    const [showProfile, setShowProfile] = useState(false);
    const logoutDialogRef = useRef<DialogRef>(null);
    const router = useRouter();
    const { user, organisations, teams, loading, error, actions } = useUser();

    const menuRef = useOutsideClick(() => {
        setShowProfile(false);
    });

    return (
        <>
            <LogOutDialog ref={logoutDialogRef}/>

            <div className={"space-y-2 px-4 pt-4"} ref={menuRef}>
                {showProfile &&
                    <div className={"flex flex-col space-y-1 py-1 bg-zinc-100 dark:bg-black-light border border-zinc-300 dark:border-edge rounded-lg shadow-xl"}>
                        <div className={"flex flex-row items-center space-x-2 px-3 py-2 mx-1 text-sm text-zinc-500 dark:text-gray rounded-lg " +
                            "hover:bg-zinc-200 dark:hover:bg-dark-light hover:text-zinc-800 dark:hover:text-white cursor-pointer"}
                             onClick={() => {
                                 setShowProfile(false);
                                 router.push(`/organisation/${organisations[0].id}`);
                             }}
                        >
                            <Briefcase size={18}/>
                            <span>My organisation</span>
                        </div>
                        <div className={"flex flex-row items-center space-x-2 px-3 py-2 mx-1 text-sm text-zinc-500 dark:text-gray rounded-lg " +
                            "hover:bg-zinc-200 dark:hover:bg-dark-light hover:text-zinc-800 dark:hover:text-white cursor-pointer"}
                        >
                            <Settings size={18}/>
                            <span>Settings</span>
                        </div>
                        <Seperator/>
                        <div className={"flex flex-row items-center space-x-2 px-3 py-2 mx-1 text-sm rounded-lg red-button-style hover:red-button-style cursor-pointer"}
                             onClick={() => {
                                 setShowProfile(false);
                                 logoutDialogRef.current?.show();
                             }}
                        >
                            <LogOut size={18}/>
                            <span>Log out</span>
                        </div>
                    </div>
                }
                <div className={cn("group w-64 flex flex-row items-center justify-between cursor-pointer bg-zinc-100 dark:bg-black-light " +
                    "border border-zinc-300 dark:border-edge rounded-lg hover:bg-zinc-200 dark:hover:bg-dark-light")}
                    onClick={() => setShowProfile(!showProfile)}>
                    {loading.user ?
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
                                <span className={"text-sm truncate w-full"}>{user?.name}</span>
                                <span className={cn("text-zinc-500 dark:text-gray text-xs truncate w-full")}>{organisations[0].name}</span>
                            </div>
                        </div>
                    }

                    <ChevronsUpDown className={cn("m-4 text-zinc-500 dark:text-gray group-hover:text-zinc-800 dark:group-hover:text-white")}/>
                </div>
            </div>
        </>
    );
});
ProfileContextMenu.displayName = "ProfileContextMenu";