export default interface IPickerBaseProps {
    disableToolbar?: boolean;
    className?: string;
    style?: React.CSSProperties;
    color?: "success" | "error" | "primary" | "secondary" | "info";
    value: string | null;
    pickerVariant?: "static" | "inline" | "dialog";
    autoClose?: boolean;
    readOnly?: boolean;
    pickerActions?: (selectedDate: Date) => React.ReactNode;
    onClose?: (submit: boolean) => void;
    onChange?: (isoDate: string) => void;
}