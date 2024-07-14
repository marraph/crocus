"use client";

import React from "react";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Box} from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    title: string;
}

export const ProjectBadge: React.FC<Props> = ({ title, className, ...props }) => {
    if (!title) return null;

    return (
        <Badge
            text={title}
            className={"bg-marcador bg-opacity-20 text-white text-xs rounded-md font-normal px-3"}
            {...props}>
            <Box size={16}/>
        </Badge>
    );
}