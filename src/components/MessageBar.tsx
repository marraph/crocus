import React, {useCallback, useEffect, useState} from "react";
import {Input} from "@marraph/daisy/components/input/Input";
import {Button} from "@marraph/daisy/components/button/Button";
import {Check, Send} from "lucide-react";
import {useUser} from "@/context/UserContext";
import { AnimatePresence, motion } from "framer-motion";
import {useInputValidation} from "@marraph/daisy/hooks/useInputValidation";

interface MessageBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MessageBar: React.FC<MessageBarProps> = ({ className, ...props }) => {
    const [message, setMessage] = useState<string>("");
    const [isClicked, setIsClicked] = useState(false);
    const [valid, setValid] = useState<boolean>(false);
    const { user } = useUser();

    useEffect(() => {
        const timer = setTimeout(() => setIsClicked(false), 2000);
        return () => clearTimeout(timer);
    }, [isClicked]);

    const validate = useCallback(() => {
        if (message.trim() === "") setValid(false);
        else setValid(true);
    }, [message]);

    useEffect(() => {
        validate();
    }, [user, message, validate]);

    const sendMessage = () => {
        setMessage("");
        setIsClicked(true);
    }
    

    return (
        <div className={"w-full h-12 flex flex-row items-center mx-4 my-2 space-x-2 pr-8 "} {...props}>
            <div className={"w-full"}>
                <Input placeholder={"Write a message..."}
                       className={"flex-grow bg-zinc-100 dark:bg-dark-light"}
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            <button className={"w-max rounded-lg font-medium text-sm py-2 px-4 flex items-center " +
                "disabled:cursor-not-allowed disabled:hover:none disabled:border-none " +
                "bg-zinc-800 dark:bg-zinc-200 text-zinc-200 dark:text-dark hover:text-white dark:hover:text-black " +
                "hover:bg-dark-light dark:hover:bg-zinc-100 border border-zinc-700 dark:border-white " +
                "disabled:text-marcador dark:disabled:text-zinc-500 disabled:bg-dark-light dark:disabled:bg-zinc-400"
            }
                    disabled={!valid}
                    onClick={sendMessage}
            >
                <AnimatePresence mode={"wait"}>
                    {isClicked ? (
                        <motion.div
                            key="check"
                            initial={{ opacity: 0, scale: 0.4}}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.4, y: '100%'}}
                            transition={{ duration: 0.2 }}
                        >
                            <Check size={18} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="clipboard"
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.4, y: '100%' }}
                            transition={{ duration: 0.2 }}
                        >
                            <Send size={18}/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
}