export default interface IPickerToolbarProps {
    disableToolbar?: boolean;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    orientation?: "portrait" | "landscape";
    color?: "inherit" | "success" | "error" | "primary" | "secondary" | "info";
}