import moment from "moment";

export function formatTimeDifference(startDate: Date, endDate: Date): string {
    const start = moment(startDate);
    const end = moment(endDate);

    const duration = moment.duration(end.diff(start));

    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

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

    result += " ago";

    return result;
}