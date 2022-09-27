import "./TimePicker.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import IDatePickerProps from "../props/IDatePickerProps";
import { IconButton, Modal, Paper, Popover, TextField } from "@mui/material";
import TimePickerBase from "./TimePickerBase";
import format from "date-fns/format";
import { AccessTime, Event } from "@mui/icons-material";

const TimePicker = (props: IDatePickerProps) => {
    const [open, setOpen] = useState<boolean>();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [value, setValue] = useState<string | null>(props.value);
    const [pickerElevation, setPickerElevation] = useState<number>();
    const [pickerSquare, setPickerSquare] = useState<boolean>();

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    useEffect(() => {
        if (props.pickerVariant === "static") {
            setOpen(true);
            if (props.elevation === 8) {
                setPickerElevation(0);
            } else {
                setPickerElevation(props.elevation);
            }

            if (!props.rounded) {
                setPickerSquare(true);
            }
        } else {
            setPickerSquare(props.square);
            setPickerElevation(props.elevation);
        }
    }, [])

    const handleClose = useCallback((submit: boolean) => {
        setOpen(false);
        props.onClose!(submit);
    }, [props.onClose, setOpen]);

    const handleChange = useCallback((date: string) => {
        if (date === "") {
            setValue(null);
        } else {
            setValue(date);
        }
        props.onChange!(date);
    }, [props.onChange, setValue]);

    const pickerRender = useMemo(() => {
        let classes = "itn-picker itn-picker-paper";
        if (props.pickerVariant === "inline") {
            classes += "itn-picker-view itn-picker-popover-paper";
        }
        if (open && props.pickerVariant === "inline") {
            classes += "itn-picker-open";
        }
        return <Paper
            elevation={pickerElevation}
            square={pickerSquare}
            className={classes}
        >
            <TimePickerBase
                autoClose={props.autoClose}
                className={props.className}
                color={props.color}
                disableToolbar={props.disableToolbar}
                onChange={handleChange}
                onClose={handleClose}
                pickerActions={props.pickerActions}
                pickerVariant={props.pickerVariant}
                readOnly={props.readOnly}
                value={value}
            />
        </Paper>
    }, [props, value, handleChange, handleClose, pickerElevation, pickerSquare, props.pickerVariant]);

    const handleAdormentClick = useCallback((e: React.MouseEvent<Element>) => {
        if (props.disabled) {
            return;
        }

        setOpen(!open);
        setAnchorEl(e.currentTarget.parentElement);
    }, [setOpen, open]);

    const handleTextFieldClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        if (props.disabled || props.editable) {
            return;
        }

        setOpen(!open);
        setAnchorEl(e.currentTarget);

    }, [setOpen, open, props.editable, props.disabled]);

    const handlePopoverClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return (
        <>
            {
                props.pickerVariant !== "static" &&
                <TextField                    
                    label={props.label}
                    margin={props.margin}
                    color={props.color}
                    size={props.size}
                    InputProps={{
                        readOnly: !props.editable! || props.readOnly,
                        endAdornment: props.endAdornment ??
                            <IconButton
                                onClick={handleAdormentClick}
                                disabled={props.disabled}
                            >
                                <AccessTime />
                            </IconButton>

                    }}
                    inputProps={{
                        style: !props.editable ? { cursor: "pointer" } : undefined
                    }}
                    onClick={handleTextFieldClick}
                    value={value === null ? "" : format(new Date(value), "HH:mm")}
                    placeholder={props.placeholder}
                    helperText={props.helperText}
                    variant={props.variant}
                    disabled={props.disabled}
                    fullWidth={props.fullWidth}
                />
                
            }
            {
                open && props.pickerVariant === "inline" ?
                    <Popover open={open} anchorEl={anchorEl} onClose={handlePopoverClose}>
                        {pickerRender}
                    </Popover> :
                    props.pickerVariant === "static" ?
                        pickerRender :
                        open && props.pickerVariant === "dialog" ?
                            <Modal
                                open={open}
                            >
                                {pickerRender}
                            </Modal> : null

            }
        </>
    );
}

TimePicker.defaultProps = {
    disableToolbar: false,
    className: "",
    orientation: "portrait",
    color: "primary",
    displayMonths: 1,
    showWeekNumbers: false,
    isDateDisabledFunc: () => false,
    minDate: new Date(1, 1, 1, 0, 0, 0, 0),
    maxDate: new Date(9999, 12, 31, 23, 59, 59, 999),
    value: null,
    pickerVariant: "inline",
    autoClose: true,
    readOnly: false,
    onClose: () => { },
    fixMonth: null,
    fixYear: null,
    fixDay: null,
    onChange: () => { },
    elevation: 8,
    rounded: false,
    square: true,
    editable: false,
    fullWidth: false
};

export default TimePicker;