"use client";

import React from "react";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {ClipboardList} from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    title: string;
}

export const EntryTitleBadge: React.FC<Props> = ({ title, className, ...props }) => {
    if (!title) return null;

    return (
        <Badge
            text={title}
            className={"bg-marcador bg-opacity-20 text-white rounded-md font-normal px-3 text-xs"}
            {...props}>
            <ClipboardList size={16}/>
        </Badge>
    );
}