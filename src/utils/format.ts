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

export function formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
}

export function formatTimeAMPM(date: Date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours < 10 ? '0' : ''}${hours}:${minutesStr}${ampm}`;
}

export function formatTimeDifference(startDate: Date, endDate: Date): string {
    const diffInMs = endDate.getTime() - startDate.getTime();
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