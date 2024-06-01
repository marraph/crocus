"use client";

import React from "react";
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
import {Dialog, DialogSeperator} from "@marraph/daisy/components/dialog/Dialog";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";

export const SearchField = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({className, ...props}) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    const closeDialog = () => {
        dialogRef.current?.close();
    };

    const outsideClickRef = useOutsideClick(closeDialog);

    return (
        <>
            <div className={"group flex flex-row items-center space-x-1 rounded-lg bg-black border border-white border-opacity-20 focus:text-white"}
                 onClick={() => dialogRef.current?.showModal()}>
                <Search size={18} className={"group-focus:text-white text-placeholder ml-2 mr-2"}/>
                <Input placeholder={"Search"} border={"none"} className={"w-max text-sm m-0 p-0 h-8 bg-black"}></Input>
                <div className={"bg-dark rounded-md w-8 py-0.5 px-1 mr-1.5"}>
                    <span className={"flex items-center text-xs text-placeholder"}>{"⌘ K"}</span>
                </div>
            </div>

            <div className={"flex items-center justify-center"}>
                <Dialog
                    className={"border border-white border-opacity-20 w-1/2 drop-shadow-lg overflow-visible"} {...props}
                    ref={dialogRef}>
                    <div ref={outsideClickRef}>
                        <div className={"flex flex-row items-center"}>
                            <Search size={18} className={"text-placeholder ml-4 mr-2"}/>
                            <Input placeholder={"Search"} border={"none"}
                                   className={"w-full text-md m-0 mr-2 p-0 h-12 bg-black"}></Input>
                        </div>
                        <DialogSeperator/>
                        <div className={"text-placeholder text-sm px-4 pt-4"}>
                            <span>{"Quick Actions"}</span>
                        </div>
                        <div className={"flex flex-col items-center px-2 py-1 font-normal"}>
                            <div
                                className={"flex flex-row items-center justify-between w-full rounded-lg text-gray hover:text-white hover:bg-dark"}>
                                <div className={"flex flex-row items-center space-x-2 ml-2 my-2"}>
                                    <SquarePen size={18}/>
                                    <span>Create new task</span>
                                </div>
                                <div className={"flex flex-row space-x-2 items-center text-xs text-gray mr-2"}>
                                    <span>{"Command"}</span>
                                    <div
                                        className={"flex items-center px-1 py-0.5 h-min rounded-md bg-dark text-placeholder text-xs"}>
                                        <span>{"⌘ T"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={"flex flex-col items-center px-2 py-1 font-normal"}>
                            <div
                                className={"flex flex-row items-center justify-between w-full rounded-lg text-gray hover:text-white hover:bg-dark"}>
                                <div className={"flex flex-row items-center space-x-2 ml-2 my-2"}>
                                    <CalendarPlus size={18}/>
                                    <span>Create new appointment</span>
                                </div>
                                <div className={"flex flex-row space-x-2 items-center text-xs text-gray mr-2"}>
                                    <span>{"Command"}</span>
                                    <div
                                        className={"flex items-center px-1 py-0.5 h-min rounded-md bg-dark text-placeholder text-xs"}>
                                        <span>{"⌘ P"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={"flex flex-col items-center px-2 pt-1 pb-2 font-normal"}>
                            <div
                                className={"flex flex-row items-center justify-between w-full rounded-lg text-gray hover:text-white hover:bg-dark"}>
                                <div className={"flex flex-row items-center space-x-2 ml-2 my-2"}>
                                    <Timer size={18}/>
                                    <span>Track your time</span>
                                </div>
                                <div className={"flex flex-row space-x-2 items-center text-xs text-gray mr-2"}>
                                    <span>{"Command"}</span>
                                    <div
                                        className={"flex items-center px-1 py-0.5 h-min rounded-md bg-dark text-placeholder text-xs"}>
                                        <span>{"⌘ F"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogSeperator/>
                        <div className={"text-placeholder text-sm px-4 pt-4"}>
                            <span>{"Recent"}</span>
                        </div>
                        <div className={"flex flex-col items-center px-2 py-1 font-normal"}>
                            <div
                                className={"flex flex-row items-center justify-between w-full rounded-lg text-gray hover:text-white hover:bg-dark"}>
                                <div className={"flex flex-row items-center space-x-2 ml-2 my-2"}>
                                    <ClipboardList size={18}/>
                                    <span>{"Task: Server API doesn't work"}</span>
                                </div>
                                <div className={"flex flex-row space-x-2 items-center text-xs text-gray mr-2"}>
                                    <span>{"Command"}</span>
                                    <div
                                        className={"flex items-center px-1 py-0.5 h-min rounded-md bg-dark text-placeholder text-xs"}>
                                        <span>{"⌘ E"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={"flex flex-col items-center px-2 pt-1 pb-2 font-normal"}>
                            <div
                                className={"flex flex-row items-center justify-between w-full rounded-lg text-gray hover:text-white hover:bg-dark"}>
                                <div className={"flex flex-row items-center space-x-2 ml-2 my-2"}>
                                    <Settings size={18}/>
                                    <span>Settings</span>
                                </div>
                                <div className={"flex flex-row space-x-2 items-center text-xs text-gray mr-2"}>
                                    <span>{"Command"}</span>
                                    <div
                                        className={"flex items-center px-1 py-0.5 h-min rounded-md bg-dark text-placeholder text-xs"}>
                                        <span>{"⌘ S"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogSeperator/>

                        <div className={"flex flex-row items-center space-x-8 px-4 h-12 text-gray text-sm"}>
                            <div className={"flex flex-row items-center space-x-2"}>
                                <span>{"Close"}</span>
                                <div
                                    className={"flex items-center px-1 py-0.5 h-min rounded-md bg-dark text-placeholder text-xs"}>
                                    <span>{"ESC"}</span>
                                </div>
                            </div>
                            <div className={"flex flex-row items-center space-x-2"}>
                                <span>{"Select"}</span>
                                <div
                                    className={"flex items-center px-1 py-0.5 h-min rounded-md bg-dark text-placeholder text-xs"}>
                                    <CornerDownLeft size={16}/>
                                </div>
                            </div>
                            <div className={"flex flex-row items-center space-x-1"}>
                                <span className={"mr-1"}>{"Navigate"}</span>
                                <div
                                    className={"flex items-center px-1 py-0.5 h-min rounded-md bg-dark text-placeholder text-xs"}>
                                    <MoveUp size={16}/>
                                </div>
                                <div
                                    className={"flex items-center px-1 py-0.5 h-min rounded-md bg-dark text-placeholder text-xs"}>
                                    <MoveDown size={16}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>

    );
});
SearchField.displayName = "SearchField";