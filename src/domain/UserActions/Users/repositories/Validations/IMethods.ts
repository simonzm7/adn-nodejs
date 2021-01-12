export interface IMethods {
    isEmail(email: string);
    isLength(value : string, type: string, conditions: { min: number, max: number });
    isString(value : string, type : string);
    isNumber(type : string,number : string);
    isRole(role : string);
    validDateFormat(date : string);
    validDay(day : number);
    validHours(IsFestive : string, Hour : number);
    isHigherOrLower(value, conditions: { min: number, max: number });
}