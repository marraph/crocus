"use client";

import React from "react";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

export const FilterBadge: React.FC<Props> = ({ value, className, ...props }) => {
    return (
        <div className={"flex flex-row items-center space-x-2 p-2 text-sm text-gray w-max h-8 bg-dark rounded-lg border border-white border-opacity-20"} {...props}>
            {props.children}
            <span className={""}>{value}</span>
            <CloseButton className={"bg-dark"} text={""}/>
        </div>
    )
}