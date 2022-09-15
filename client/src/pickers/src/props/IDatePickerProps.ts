import React from "react";
import IDatePickerBaseProps from "./IDatePickerBaseProps";

export default interface IDatePickerProps extends IDatePickerBaseProps {
    elevation?: number;
    rounded?: boolean;
    square?: boolean;
    editable?: boolean;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    helperText?: string;
    variant?: "standard" | "filled" | "outlined";
    margin?: "none" | "dense" | "normal";
    size?: "small" | "medium";
    endAdornment?: React.ReactNode;
    fullWidth?: boolean;
}