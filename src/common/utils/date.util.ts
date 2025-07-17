import dayjs from 'dayjs';

export class DateUtil {
    static format(date: Date, format: string): string {
        return dayjs(date).format(format);
    }
}