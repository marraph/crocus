"use client";

import React from "react";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {ClipboardList} from "lucide-react";
import {cn} from "@/utils/cn";

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    title: string;
    textClassName?: string;
}

export const EntryTaskBadge: React.FC<Props> = ({ title, textClassName, className, ...props }) => {

    return (
        <Badge
            text={title}
            className={cn("bg-marcador bg-opacity-20 text-white text-xs rounded-md font-normal", className)}
            textClassName={textClassName}
            {...props}>
            <ClipboardList size={16}/>
        </Badge>
    );
}