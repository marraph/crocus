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