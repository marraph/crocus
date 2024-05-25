"use client";

import {Badge} from "@marraph/daisy/components/badge/Badge";
import React from "react";
import {cn} from "@/utils/cn";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    color: string;
}

export const TopicBadge: React.FC<Props> = ({ title, color, className, ...props }) => {
    return (
        <Badge
            text={title}
            className={cn("w-max bg-error text-error font-normal px-2 py-0.5 bg-opacity-20 rounded-lg", className)}
            {...props}>
        </Badge>
    )
}