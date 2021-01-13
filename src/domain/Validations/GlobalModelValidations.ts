import { Roles } from '../Appointments/Enums/Roles';
import { BussinessExcp } from '../Exceptions/BussinessExcp';

class GlobalValidations {

    private readonly regex = {
        email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        stringOnly: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
        numberOnly: /^[0-9]+$/,
        date: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-1]))(\/)\d{4}(\/)(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/
    }

    private readonly Holidays = [
        '01/00',
        '11/00',
        '22/02',
        '01/03',
        '02/03',
        '01/04',
        '17/04',
        '07/05',
        '14/05',
        '05/06',
        '20/06',
        '07/07',
        '17/07',
        '18/09',
        '01/10',
        '15/10',
        '08/11',
        '25/11'
    ]

    isEmail = (email: string) => {
        if (!(this.regex.email.test(email))) {
            throw new BussinessExcp({ code: 'invalid_email_format' });
        }
    };

    isLength = (value, type, conditions: { min: number, max: number }) => {
        if (value.length < conditions.min) {
            throw new BussinessExcp({ code: `invalid_${type}_minimum_length`, allowedLength: conditions.min });
        }
        if (value.length > conditions.max) {
            throw new BussinessExcp({ code: `invalid_${type}_maximum_length`, allowedLength: conditions.min });
        }
    };

    isHigherOrLower = (value, conditions: { min: number, max: number }) => {
        if ((+value) < conditions.min) {
            throw new BussinessExcp({ code: 'invalid_minimum_appointment_cost', allowedCost: conditions.min });
        }
        if ((+value) > conditions.max) {
            throw new BussinessExcp({ code: 'invalid_maximum_appointment_cost', allowedCost: conditions.max });
        }
    }
    isString = (value: string, type: string) => {
        if (!this.regex.stringOnly.test(value)) {
            throw new BussinessExcp({ code: `invalid_${type}_format` });
        }
    };
    isNumber = (type: string, number: string) => {
        if (!this.regex.numberOnly.test(number)) {
            throw new BussinessExcp({ code: 'invalid_' + type + '_format' });
        }
    };
    isRole = (role: string) => {
        if (!(role === Roles.Customer || role === Roles.Doctor)) {
            throw new BussinessExcp({ code: 'invalid_role' });
        }
    };
    validDateFormat = (date: string) => {
        if (!this.regex.date.test(date)) {
            throw new BussinessExcp({ code: 'invalid_date_format' });
        }
    }
    validDay = (day: number) => {
        if (day === 0) {
            throw new BussinessExcp({ code: 'invalid_appointment_day' });
        }
    }
    validHours = (appointmentDate: string, Hour: number) => {
        const Holiday = this.Holidays.filter(d => d === appointmentDate.substring(0, 5));
        const SEVEN_AM = 7;
        const TWELVE_PM = 12;
        const TEN_AM = 10;
        const NO_HOLIDAY_END_DAY = 17;
        const HOLIDAY_END_DAY = 15;
        if (Holiday.length === 0 && Hour < SEVEN_AM || Hour === TWELVE_PM || Hour > NO_HOLIDAY_END_DAY) {
            throw new BussinessExcp({ code: 'invalid_appointment_schedule' });
        }

        if (Holiday.length > 0 && Hour < TEN_AM || Hour === TWELVE_PM || Hour > HOLIDAY_END_DAY) {
            throw new BussinessExcp({ code: 'invalid_appointment_schedule' });
        }
    }
}
export default new GlobalValidations;
