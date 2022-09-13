export default interface IDatePickerProps {
    disableToolbar?: boolean;
    className?: string;
    style?: React.CSSProperties;
    orientation?: "portrait" | "landscape";
    color?: "success" | "error" | "primary" | "secondary" | "info";
    maxMonthColumns?: number;
    displayMonths?: number;
    minDate?: Date;
    maxDate?: Date;
    value: string | null;
    fixYear?: number;
    fixDay?: number;
    fixMonth?: number;
    showWeekNumbers?: boolean;
    isDateDisabledFunc?: (date: Date) => boolean;
    pickerVariant?: "static" | "inline" | "dialog";
    autoClose?: boolean;
    readOnly?: boolean;
    pickerActions?: (selectedDate: Date) => React.ReactNode;
    onClose?: (selected: boolean) => void;
    onChange?: (isoDate: string) => void;
}