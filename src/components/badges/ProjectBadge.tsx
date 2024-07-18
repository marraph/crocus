"use client";

import React from "react";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Box} from "lucide-react";
import {cn} from "@/utils/cn";

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    title: string;
    textClassName?: string;
}

export const ProjectBadge: React.FC<Props> = ({ title, textClassName, className, ...props }) => {

    return (
        <Badge
            text={title}
            className={cn("bg-marcador bg-opacity-20 text-white text-xs rounded-md font-normal truncate", className)}
            textClassName={textClassName}
            {...props}>
            <Box size={16}/>
        </Badge>
    );
}