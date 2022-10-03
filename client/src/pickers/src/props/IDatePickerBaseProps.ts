import IPickerBaseProps from "./IPickerBaseProps";

export default interface IDatePickerBaseProps extends IPickerBaseProps {
    orientation?: "portrait" | "landscape";
    color?: "success" | "error" | "primary" | "secondary" | "info";
    maxMonthColumns?: number;
    displayMonths?: number;
    minDate?: Date;
    maxDate?: Date;
    fixYear?: number;
    fixDay?: number;
    fixMonth?: number;
    showWeekNumbers?: boolean;
    isDateDisabledFunc?: (date: Date) => boolean;
    locale?: Locale;
}