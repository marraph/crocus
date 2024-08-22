import React, {RefObject} from "react";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {motion} from "framer-motion";
import {
    AlarmClockPlus,
    CalendarFold,
    FolderCheck,
    History,
    Hourglass,
    LayoutList,
    SquarePen,
    StickyNote
} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";

export const EntryPlaceholder: React.FC<{ dialogRef: RefObject<DialogRef>}> = ({ dialogRef }) => {

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
            className={"flex flex-col space-y-4 items-center justify-center w-1/2 h-1/3 rounded-lg "}
            variants={containerVariants}
            initial="initial"
            whileHover="hover"
        >
            <motion.div
                className="flex flex-row items-center space-x-2"
                variants={iconContainerVariants}
            >
                <CalendarFold size={36} className="-rotate-12"/>
                <History size={36}/>
                <Hourglass size={36} className="rotate-12"/>
            </motion.div>

            <div className={"flex flex-col space-y-2 items-center justify-center"}>

                <span className={"text-lg"}>You have no entries yet</span>
                <span className={"text-sm text-zinc-500 dark:text-gray font-normal"}>Create your first entry today to review your work</span>
                <Button text={"Create Entry"}
                        onClick={() => dialogRef.current?.show()}
                        icon={<AlarmClockPlus size={20}/>}
                        className={"hover:bg-zinc-200 dark:hover:bg-dark-light"}
                />
            </div>

        </motion.div>
    );
}