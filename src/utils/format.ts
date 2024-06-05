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