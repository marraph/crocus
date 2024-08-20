import React, {RefObject} from "react";
import {motion} from "framer-motion";
import {FolderCheck, LayoutList, SquarePen, StickyNote} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";

export const TaskPlaceholder: React.FC<{ dialogRef: RefObject<DialogRef>}> = ({ dialogRef }) => {

    const containerVariants = {
        initial: {},
        hover: {}
    };

    const iconContainerVariants = {
        initial: { y: 0 },
        hover: { y: -20, transition: { duration: 0.3 } }
    };


    return (
        <motion.div
            className={"flex flex-col space-y-4 items-center justify-center w-1/2 h-1/3 rounded-lg"}
            variants={containerVariants}
            initial="initial"
            whileHover="hover"
        >
            <motion.div
                className="flex flex-row items-center space-x-2"
                variants={iconContainerVariants}
            >
                <StickyNote size={36} className="-rotate-12"/>
                <LayoutList size={36}/>
                <FolderCheck size={36} className="rotate-12"/>
            </motion.div>

            <div className={"flex flex-col space-y-2 items-center justify-center"}>

                <span className={"text-lg"}>You have no tasks yet</span>
                <span className={"text-sm text-zinc-500 dark:text-gray font-normal"}>Create your first task to get started with your workflow</span>
                <Button text={"Create task"}
                        onClick={() => dialogRef.current?.show()}
                        icon={<SquarePen size={20} className={"mr-2"}/>}
                        className={"hover:bg-zinc-200 dark:hover:bg-dark-light"}
                />
            </div>

        </motion.div>
    );
}