"use client";

import React from "react";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {cn} from "@/utils/cn";
import {Box, Users} from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    title: string;
    textClassName?: string;
}

export const MembersBadge: React.FC<Props> = ({ title, textClassName, className, ...props }) => {

    return (
        <Badge
            text={title}
            className={cn("bg-zinc-400 dark:bg-marcador bg-opacity-20 text-zinc-800 dark:text-white text-xs rounded-md font-normal truncate", className)}
            textClassName={textClassName}
            {...props}>
            <Users size={16}/>
        </Badge>
    );
}