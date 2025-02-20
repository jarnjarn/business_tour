import moment from 'moment';

export class DateUtil {
    static format(date: Date, format: string): string {
        return moment(date).format(format);
    }
}