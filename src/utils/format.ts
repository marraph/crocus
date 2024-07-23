
export function formatDate(dateString: string | undefined): string {

    if (dateString === undefined) {
        return "";
    }

    const date = new Date(dateString);

    const monthNames: string[] = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const year: number = date.getFullYear();
    const month: string = monthNames[date.getMonth()];
    const day: number = date.getDate();

    return `${month} ${day}, ${year}`;
}

export function formatTime(date: Date, timeTo: any): string {
    const newDate = new Date(date);
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
}

export function formatTimeClock(date: Date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function formatTimeDifference(startDate: Date, endDate: Date): string {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    const diffInMs = newEndDate.getTime() - newStartDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const days = Math.floor(diffInMinutes / (60 * 24));
    const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
    const minutes = diffInMinutes % 60;

    console.log(days, hours, minutes)

    let result = '';
    if (days > 0) {
        result += `${days}d `;
    }
    if (days === 0 && hours > 0) {
        result += `${hours}h `;
    }
    if (days === 0 && hours === 0 && minutes > 0) {
        result += `${minutes}min`;
    }
    if (days === 0 && hours === 0 && minutes === 0) {
        result = '0min';
    }

    result+= " ago";

    return result;
}