export default interface IDatePickerProps {
    disableToolbar?: boolean;
    className?: string;
    style?: React.CSSProperties;
    orientation?: "portrait" | "landscape";
    color?: "inherit" | "success" | "error" | "primary" | "secondary" | "info";
    maxMonthColumns?: number;
    displayMonths?: number;
    minDate?: Date;
    maxDate?: Date;
    value: Date;
    fixYear?: number;
    fixDay?: number;
    fixMonth?: number;
    showWeekNumbers?: boolean;
    isDateDisabledFunc?: (date: Date) => boolean;
}