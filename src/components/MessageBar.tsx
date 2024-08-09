import React, {useEffect, useState} from "react";
import {Input} from "@marraph/daisy/components/input/Input";
import {Button} from "@marraph/daisy/components/button/Button";
import {Send} from "lucide-react";
import {useUser} from "@/context/UserContext";

interface MessageBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MessageBar: React.FC<MessageBarProps> = ({ className, ...props }) => {
    const [message, setMessage] = useState<string>("");
    const [valid, setValid] = useState<boolean>(false);
    const { data:user, isLoading:userLoading, error:userError } = useUser();

    useEffect(() => {
        validate();
    }, [user, message]);

    const sendMessage = () => {
        setMessage("");
    }

    const validate = () => {
        if (message.trim() === "") setValid(false);
        else setValid(true);
    }

    return (
        <div className={"w-full h-12 flex flex-row items-center mx-4 my-2 space-x-2 pr-8 "} {...props}>
            <Input placeholder={"Write a message..."}
                   className={"w-full flex-grow bg-dark-light"}
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
            />
            <Button text={""}
                    icon={<Send size={20}/>}
                    theme={"white"}
                    disabled={!valid}
                    onClick={sendMessage}
            />
        </div>
    );
}