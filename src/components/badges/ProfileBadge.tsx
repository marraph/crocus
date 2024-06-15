"use client";

import React from "react";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {cn} from "@/utils/cn";
import { Status } from "@/types/types";
import { Circle } from "lucide-react";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    name?: string;
}

const path = "/image.png";

export const ProfileBadge: React.FC<Props> = ({ name, className, ...props }) => {
    if (!name) return null;

    return (
        <Badge
            text={name}
            className={"bg-badgegray border border-white border-opacity-20 text-gray rounded-md font-normal px-3 text-xs"}
            {...props}>
            <Avatar img_url={path} size={20} className={"p-0"}/>
        </Badge>
    );
}