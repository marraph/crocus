import {Filter, FilterItem, FilterRef} from "@marraph/daisy/components/filter/Filter";
import {BookCopy, LineChart, SmartphoneCharging, Tag, User, Users} from "lucide-react";
import {useRef, useState} from "react";

const teams = ["Frontend", "Backend", "Design", "Management", "Marketing", "Support"];
const projects = ["ServerAPI", "ClientAPI", "Website", "App", "Database"];
const topics = ["bug", "feature", "task"];
const statuses = ["todo", "in progress", "done"];
const priorities = ["low", "medium", "high"];
const creators = ["mvriu5", "marraph", "johndoe", "janedoe"];


export function FilterContext() {
    const filterRef = useRef<FilterRef>(null);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});

    const handleFilterChange = (filters: { [key: string]: string | null }) => {
        setSelectedFilters(filters);
    }

    return (
        <Filter ref={filterRef} onFilterChange={handleFilterChange}>
            <FilterItem title={"Team"} data={teams} icon={<Users size={16}/>}></FilterItem>
            <FilterItem title={"Project"} data={projects} icon={<BookCopy size={16}/>}></FilterItem>
            <FilterItem title={"Topic"} data={topics} icon={<Tag size={16}/>}></FilterItem>
            <FilterItem title={"Status"} data={statuses} icon={<SmartphoneCharging size={16}/>}></FilterItem>
            <FilterItem title={"Priority"} data={priorities} icon={<LineChart size={16}/>}></FilterItem>
            <FilterItem title={"Creator"} data={creators} icon={<User size={16}/>}></FilterItem>
        </Filter>
    );
}