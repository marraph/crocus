"use client";

import React from "react";
import {Input} from "@marraph/daisy/components/input/Input";
import {Search} from "lucide-react";

export function SearchField() {
    return (
        <div className={"group w-min flex flex-row items-center rounded-lg bg-black border border-white border-opacity-20 focus:text-white"}>
            <Search size={18} className={"group-focus:text-white text-placeholder ml-2 mr-2"} />
            <Input placeholder={"Search"} className={"m-0 p-0 w-80 h-10 focus-visible:ring-0 border-0 bg-none focus-visible:outline-none"}></Input>
            <div className={"bg-dark rounded-md w-8 p-1 mr-2"}>
                <span className={"flex items-center text-xs text-placeholder"}>{"⌘ K"}</span>
            </div>
        </div>
    );
}