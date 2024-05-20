import {TaskCard} from "@/components/cards/TaskCard";

const tasks = [
    {
        id: 1,
        title: "Task 1",
        topic: "Topic 1",
        priority: "high",
        team: "Team 1",
        project: "Project 1",
        status: "Status 1",
        createdAt: "Created At 1",
        createdBy: "Created By 1",
        dueDate: "dueDate"
    },
    {
        id: 2,
        title: "Task 2",
        topic: "Topic 2",
        priority: "high",
        team: "Team 2",
        project: "Project 2",
        status: "Status 2",
        createdAt: "Created At 2",
        createdBy: "Created By 2",
        dueDate: "dueDate"
    },
    {
        id: 3,
        title: "Task 3",
        topic: "Topic 3",
        priority: "high",
        team: "Team 3",
        project: "Project 3",
        status: "Status 3",
        createdAt: "Created At 3",
        createdBy: "Created By 3",
        dueDate: "dueDate"
    },
    {
        id: 4,
        title: "Task 4",
        topic: "Topic 4",
        priority: "high",
        team: "Team 4",
        project: "Project 4",
        status: "Status 4",
        createdAt: "Created At 4",
        createdBy: "Created By 4",
        dueDate: "dueDate"
    },
    {
        id: 5,
        title: "Task 5",
        topic: "Topic 5",
        priority: "high",
        team: "Team 5",
        project: "Project 5",
        status: "Status 5",
        createdAt: "Created At 5",
        createdBy: "Created By 5",
        dueDate: "dueDate"
    },
    {
        id: 6,
        title: "Task 6",
        topic: "Topic 6",
        priority: "high",
        team: "Team 6",
        project: "Project 6",
        status: "Status 6",
        createdAt: "Created At 6",
        createdBy: "Created By 6",
        dueDate: "dueDate"
    },
    {
        id: 7,
        title: "Task 7",
        topic: "Topic 7",
        priority: "high",
        team: "Team 7",
        project: "Project 7",
        status: "Status 7",
        createdAt: "Created At 7",
        createdBy: "Created By 7",
        dueDate: "dueDate"
    },
    {
        id: 8,
        title: "Task 8",
        topic: "Topic 8",
        priority: "high",
        team: "Team 8",
        project: "Project 8",
        status: "Status 8",
        createdAt: "Created At 8",
        createdBy: "Created By 8",
        dueDate: "dueDate"
    },
    {
        id: 9,
        title: "Task 9",
        topic: "Topic 9",
        priority: "high",
        team: "Team 9",
        project: "Project 9",
        status: "Status 9",
        createdAt: "Created At 9",
        createdBy: "Created By 9",
        dueDate: "dueDate"
    },
    {
        id: 10,
        title: "Task 10",
        topic: "Topic 10",
        priority: "high",
        team: "Team 10",
        project: "Project 10",
        status: "Status 10",
        createdAt: "Created At 10",
        createdBy: "Created By 10",
        dueDate: "dueDate"
    }
];

export function TaskCardView() {

    return (
        <div className={"grid grid-cols-5 gap-9 pt-4 pb-8 px-8"}>
            {tasks.map((task, index) => (
                <TaskCard key={index} _id={task.id} title={task.title} topic={task.topic} priority={task.priority} team={task.team} project={task.project}
                          status={task.status} createdAt={task.createdAt} createdBy={task.createdBy} dueDate={task.dueDate}/>
            ))}
        </div>
    );
}