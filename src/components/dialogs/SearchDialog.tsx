"use client";

import React, {forwardRef} from "react";
import {Input} from "@marraph/daisy/components/input/Input";
import {
    CalendarPlus,
    ClipboardList,
    CornerDownLeft,
    MoveDown,
    MoveUp,
    Search,
    Settings,
    SquarePen,
    Timer
} from "lucide-react";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {Shortcut} from "@marraph/daisy/components/shortcut/Shortcut";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {mutateRef} from "@/utils/mutateRef";


export const SearchDialog = forwardRef<DialogRef>(({}, ref) => {
    const dialogRef = mutateRef(ref);

    const outsideClickRef = useOutsideClick(() => {
        dialogRef?.current?.close();
    });

    return (
        <div className={"flex items-center justify-center"}>
            <dialog
                className={"group backdrop:bg-black/60 backdrop backdrop-opacity-20 backdrop-brightness-0 rounded-lg bg-black overflow-visible border border-edge"}
                ref={dialogRef ?? undefined}
                style={{width: 700}}
            >
                <div ref={outsideClickRef}>
                    <div className={"flex flex-row items-center"}>
                        <Search size={18}
                                className={"text-marcador ml-4 mr-2"}
                        />
                        <Input placeholder={"Search or type a command"}
                               border={"none"}
                               className={"w-full text-md m-0 mr-2 p-0 h-12 bg-black"}
                        />
                    </div>
                    <Seperator/>
                    <div className={"text-marcador text-sm px-4 pt-4"}>
                        <span>{"Quick Actions"}</span>
                    </div>
                    <div className={"flex flex-col items-center px-2 py-1 font-normal cursor-pointer"}>
                        <div
                            className={"flex flex-row items-center justify-between w-full rounded-lg text-gray hover:text-white hover:bg-dark"}>
                            <div className={"flex flex-row items-center space-x-2 ml-2 my-2"}>
                                <SquarePen size={18}/>
                                <span>Create new task</span>
                            </div>
                            <div className={"flex flex-row space-x-2 items-center text-xs text-gray mr-2"}>
                                <span>{"Command"}</span>
                                <Shortcut text={"⌘ T"}/>
                            </div>
                        </div>
                    </div>

                    <div className={"flex flex-col items-center px-2 py-1 font-normal cursor-pointer"}>
                        <div
                            className={"flex flex-row items-center justify-between w-full rounded-lg text-gray hover:text-white hover:bg-dark"}>
                            <div className={"flex flex-row items-center space-x-2 ml-2 my-2"}>
                                <CalendarPlus size={18}/>
                                <span>Create new appointment</span>
                            </div>
                            <div className={"flex flex-row space-x-2 items-center text-xs text-gray mr-2"}>
                                <span>{"Command"}</span>
                                <Shortcut text={"⌘ P"}/>
                            </div>
                        </div>
                    </div>

                    <div className={"flex flex-col items-center px-2 pt-1 pb-2 font-normal cursor-pointer"}>
                        <div
                            className={"flex flex-row items-center justify-between w-full rounded-lg text-gray hover:text-white hover:bg-dark"}>
                            <div className={"flex flex-row items-center space-x-2 ml-2 my-2"}>
                                <Timer size={18}/>
                                <span>Track your time</span>
                            </div>
                            <div className={"flex flex-row space-x-2 items-center text-xs text-gray mr-2"}>
                                <span>{"Command"}</span>
                                <Shortcut text={"⌘ F"}/>
                            </div>
                        </div>
                    </div>
                    <Seperator/>
                    <div className={"text-placeholder text-sm px-4 pt-4"}>
                        <span>{"Recent"}</span>
                    </div>
                    <div className={"flex flex-col items-center px-2 py-1 font-normal cursor-pointer"}>
                        <div
                            className={"flex flex-row items-center justify-between w-full rounded-lg text-gray hover:text-white hover:bg-dark"}>
                            <div className={"flex flex-row items-center space-x-2 ml-2 my-2"}>
                                <ClipboardList size={18}/>
                                <span>{"Task: Server API doesn't work"}</span>
                            </div>
                            <div className={"flex flex-row space-x-2 items-center text-xs text-gray mr-2"}>
                                <span>{"Command"}</span>
                                <Shortcut text={"⌘ E"}/>
                            </div>
                        </div>
                    </div>

                    <div className={"flex flex-col items-center px-2 pt-1 pb-2 font-normal cursor-pointer"}>
                        <div
                            className={"flex flex-row items-center justify-between w-full rounded-lg text-gray hover:text-white hover:bg-dark"}>
                            <div className={"flex flex-row items-center space-x-2 ml-2 my-2"}>
                                <Settings size={18}/>
                                <span>Settings</span>
                            </div>
                            <div className={"flex flex-row space-x-2 items-center text-xs text-gray mr-2"}>
                                <span>{"Command"}</span>
                                <Shortcut text={"⌘ S"}/>
                            </div>
                        </div>
                    </div>

                    <Seperator/>

                    <div className={"flex flex-row items-center space-x-8 px-4 h-12 text-gray text-sm"}>
                        <div className={"flex flex-row items-center space-x-2 cursor-pointer"}>
                            <span>{"Close"}</span>
                            <Shortcut text={"ESC"}/>
                        </div>
                        <div className={"flex flex-row items-center space-x-2 cursor-pointer"}>
                            <span>{"Select"}</span>
                            <Shortcut>
                                <CornerDownLeft size={16}/>
                            </Shortcut>
                        </div>
                        <div className={"flex flex-row items-center space-x-1 cursor-pointer"}>
                            <span className={"mr-1"}>{"Navigate"}</span>
                            <Shortcut>
                                <MoveUp size={16}/>
                            </Shortcut>
                            <Shortcut>
                                <MoveDown size={16}/>
                            </Shortcut>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );
});
SearchDialog.displayName = "SearchDialog";