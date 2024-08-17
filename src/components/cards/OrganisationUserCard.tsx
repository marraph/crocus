import React, {useCallback, useMemo, useState} from "react";
import {EllipsisVertical, Plus, Search, User} from "lucide-react";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";

const userCount = 10;

const users = [
    {name: "John Doe",},
    {name: "Jane Doe",},
    {name: "John Smith",},
    {name: "Jane Smith",},
    {name: "John Doe",},
    {name: "Jane Doe",}];

export const OrganisationUserCard: React.FC<{}> = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const searchValues = useMemo(() => {
        return users.filter(value =>
            value.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className={"size-80 rounded-lg border border-edge"}>

            <div className={"flex flex-row justify-between items-center p-2 border-b border-edge bg-dark rounded-t-lg"}>
                <div className={"flex flex-row space-x-2 items-center text-gray"}>
                    <User size={20}/>
                    <span>{"Users (" + userCount + ")"}</span>
                </div>
                <div className={"text-gray hover:text-white hover:bg-dark rounded-lg p-1 cursor-pointer"}>
                    <Plus size={20}/>
                </div>
            </div>

            <div className={"flex flex-row space-x-2 items-center px-2 py-1 border-b border-edge"}>
                <Search size={16} className={"text-gray"}/>
                <input placeholder={"Search a user"}
                       value={searchTerm}
                       onChange={handleInputChange}
                       className={"w-full bg-black-light text-white-dark p-1 focus:outline-0 placeholder-marcador text-sm"}
                />
            </div>

            <div className={"flex flex-col space-y-1 p-2"}>
                {searchValues.map((user, index) => (
                    <div key={index} className={"flex flex-row items-center justify-between rounded-lg hover:bg-dark"}>
                        <div className={"flex flex-row items-center space-x-4 text-gray px-2 py-1 hover:text-white cursor-pointer"}>
                            <Avatar img_url={"/image.png"} size={20}/>
                            <span>{user.name}</span>
                        </div>
                        <div className={"hover:bg-dark rounded-lg p-1 cursor-pointer text-gray hover:text-white"}>
                            <EllipsisVertical size={20}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}