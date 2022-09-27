import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import "./TimePickerBase.css";
import "../common/base.css";
import PickerToolbar from "../common/PickerToolbar";
import PickerContent from "../common/PickerContent";
import { Button, SxProps, Theme, Typography, useTheme } from "@mui/material";
import ITimePickerBaseProps from '../props/ITimePickerBaseProps';
import { format } from 'date-fns';
const { ru } = require('date-fns/locale');

function toAmPmHour(time: Date) {
    let h = time.getHours() % 12;
    if (h == 0)
        h = 12;
    return h;
}

class TimeSet {
    hour: number = 0;
    minute: number = 0;
}

const hoursArray = Array.from({ length: 12 }, (_, i) => i + 1);
const minutesArray = Array.from({ length: 60 }, (_, i) => i + 1);

const TimePickerBase = (props: ITimePickerBaseProps) => {
    const theme = useTheme();

    const [currentView, setCurrentView] = useState<"date" | "year" | "month" | "hours" | "minutes">("hours");
    const [timeIntermediate, setTimeIntermediate] = useState<Date | null>(props.value === null ? null : new Date(props.value));
    const [timeSet, setTimeSet] = useState<TimeSet>(props.value === null ? new TimeSet() : { hour: new Date(props.value).getHours(), minute: new Date(props.value).getMinutes() } as TimeSet);
    const [initialMinute,] = useState<number>(props.value === null ? 0 : new Date(props.value).getMinutes());
    const [initialHour,] = useState<number>(props.value === null ? 0 : new Date(props.value).getHours());

    const [mouseDown, setMouseDown] = useState(false);

    const handleHourClick = useCallback(() => {
        setCurrentView("hours");
    }, [setCurrentView]);

    const handleMinutesClick = useCallback(() => {
        setCurrentView("minutes");
    }, [setCurrentView]);

    const hoursString = useMemo(() => {
        if (timeIntermediate == null)
            return "--";

        const h = props.amPm ? toAmPmHour(timeIntermediate) : timeIntermediate.getHours();
        return Math.min(23, Math.max(0, h)).toLocaleString("en-US", { minimumIntegerDigits: 2 });
    }, [timeIntermediate, props.amPm]);

    const minutesString = useMemo(() => {
        if (timeIntermediate == null)
            return "--";

        return Math.min(59, Math.max(0, timeIntermediate.getMinutes())).toLocaleString("en-US", { minimumIntegerDigits: 2 });
    }, [timeIntermediate]);

    const getTransform = useCallback((angle: number, radius: number, offsetX: number, offsetY: number) => {
        angle = angle / 180 * Math.PI;
        const x = (Math.sin(angle) * radius + offsetX).toFixed(3);
        const y = ((Math.cos(angle) + 1) * radius + offsetY).toFixed(3);
        return `translate(${x}px, ${y}px)`;
    }, []);

    const getNumberStyle = useCallback((theme: Theme, value: number, angle: number, radius: number, offsetX: number, offsetY: number) => {
        let style: SxProps = {
            color: undefined,
            transform: undefined
        };
        if (currentView === "hours") {
            let h = timeSet.hour;
            if (props.amPm) {
                h = timeSet.hour % 12;
                if (timeSet.hour % 12 == 0) {
                    h = 12;
                }
            }

            if (h === value) {
                style.color = theme.palette[props.color!].contrastText;
            }
        } else if (currentView === "minutes" && timeSet.minute === value) {
            style.color = theme.palette[props.color!].contrastText;
        }

        style.transform = getTransform(angle, radius, offsetX, offsetY);

        return style;
    }, [currentView, timeSet, props.amPm, theme, props.color, getTransform]); 

    const submit = useCallback((value: Date | null) => {
        if (props.readOnly) {
            return;
        }

        props.onChange!(value === null ? "" : value.toISOString());
    }, [props.onChange, props.readOnly]);

    const submitAndClose = useCallback((value: Date | null) => {
        if (props.pickerActions === null || props.autoClose) {
            submit(value);
            if (props.pickerVariant !== "static") {
                props.onClose!(false);
            }
        }
    }, [props.onChange, props.pickerVariant, props.readOnly, props.onClose]);


    const updateTime = useCallback((value: TimeSet) => {
        const newVal = new Date(1, 1, 1, value.hour, value.minute);
        setTimeIntermediate(newVal);
        if ((props.pickerVariant === "static" && props.pickerActions === null) || (props.pickerActions !== null && props.autoClose)) {
            submit(newVal);
        }
    }, [setTimeIntermediate, props.pickerVariant, props.pickerActions, props.autoClose, submit]);

    const handleMouseClickHour = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>, value: number) => {
        e.stopPropagation();
        const h = value;
        if (props.amPm) {
            /*if (IsAm && value == 12)
                h = 0;
            else if (IsPm && value < 12)
                h = value + 12;*/
        }
        const newVal = {
            hour: h,
            minute: timeSet.minute
        } as TimeSet;
        setTimeSet(newVal);
        updateTime(newVal);

        if (props.timeEditMode === "normal") {
            setCurrentView("minutes");
        } else if (props.timeEditMode === "onlyHours") {
            submitAndClose(new Date(1, 1, 1, h));
        }
    }, [props.amPm, setTimeSet, timeSet, props.timeEditMode, setCurrentView, updateTime]);

    const handleMouseClickMinute = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>, value: number) => {
        e.stopPropagation();

        const newVal = {
            hour: timeSet.hour,
            minute: value
        } as TimeSet;
        setTimeSet(newVal);
        updateTime(newVal);

        submitAndClose(new Date(1, 1, 1, timeSet.hour, value));
    }, [setTimeSet, timeSet, submitAndClose, updateTime]);

    const handleMouseOverHour = useCallback((value: number) => {
        if (mouseDown) {
            const newVal = {
                hour: value,
                minute: timeSet.minute
            } as TimeSet;
            setTimeSet(newVal);
            updateTime(newVal);
        }
    }, [mouseDown, setTimeSet, timeSet, updateTime]);

    const handleMouseOverMinute = useCallback((value: number) => {
        if (mouseDown) {
            const newVal = {
                hour: timeSet.hour,
                minute: value
            } as TimeSet;
            setTimeSet(newVal);
            updateTime(newVal);
        }
    }, [mouseDown, setTimeSet, timeSet, updateTime]);

    const handleMouseDown = useCallback(() => setMouseDown(true), [setMouseDown]);
    const handleMouseUp = useCallback(() => {
        if (mouseDown && ((currentView === "minutes" && timeSet.minute !== initialMinute) || (currentView === "hours" && timeSet.hour !== initialHour && props.timeEditMode === "onlyHours"))) {
            setMouseDown(false);
            submitAndClose(new Date(1, 1, 1, timeSet.minute, timeSet.hour));
        }

        setMouseDown(false);

        if (currentView === "hours" && timeSet.hour !== initialHour && props.timeEditMode === "normal") {
            setCurrentView("minutes");
        }
    }, [mouseDown, currentView, timeSet.minute, timeSet, initialHour, initialMinute, setCurrentView, setMouseDown]);

    const getPointerHeight = useCallback(() => {
        let height = 40;
        if (currentView === "minutes") {
            height = 40;
        }
        if (currentView === "hours") {
            if (/*!AmPm*/true && timeSet.hour > 0 && timeSet.hour < 13)
                height = 26;
            else
                height = 40;
        }
        return `${height}%`;
    }, [currentView, timeSet]);

    const getPointerRotation = useCallback(() => {
        let deg = 0;
        if (currentView === "hours") {
            deg = (timeSet.hour * 30) % 360;
        }
        if (currentView === "minutes") {
            deg = (timeSet.minute * 6) % 360;
        }
        return `rotateZ(${deg}deg)`;
    }, [currentView, timeSet]);

    const getDeg = useCallback(() => { 
        let deg = 0;
        if (currentView === "hours") {
            deg = (timeSet.hour * 30) % 360;
        }
        if (currentView === "minutes") {
            deg = (timeSet.minute * 6) % 360;
        }
        return deg;
    }, [currentView, timeSet]);

    return (
        <>
            <PickerToolbar className="itn-picker-timepicker-toolbar" disableToolbar={props.disableToolbar} color={props.color!}>
                <div className="itn-timepicker-hourminute itn-ltr">
                    {
                        props.timeEditMode === "normal" ?
                            <>
                                <Button variant="text" sx={theme => ({ color: theme.palette[props.color!].contrastText })} className={`itn-timepicker-button ${currentView === "minutes" ? "itn-timepicker-toolbar-text" : ""}`} onClick={handleHourClick}>{hoursString}</Button>
                                <Typography variant="h2" color={theme => theme.palette[props.color!].contrastText} className="itn-timepicker-separator">:</Typography>
                                <Button variant="text" sx={theme => ({ color: theme.palette[props.color!].contrastText })} className={`itn-timepicker-button ${currentView === "hours" ? "itn-timepicker-toolbar-text" : ""}`} onClick={handleMinutesClick}>{minutesString}</Button>
                            </> :
                            <Typography variant="h2" className="itn-timepicker-separator">{hoursString}:{minutesString}</Typography>
                    }
                </div>                
                {
                    props.amPm &&
                        <div className="itn-timepicker-ampm">
                            <Button variant="text" color="inherit" className="@AmButtonClass" /*onClick={handleAmClicked} TODO AM PM*/>AM</Button>
                            <Button variant="text" color="inherit" className="@PmButtonClass" /*onClick={handlePmClicked} TODO AM PM*/>PM</Button>
                        </div>
                }
            </PickerToolbar>
            <PickerContent>                
                <div className="itn-picker-time-container">
                    <div className="itn-picker-time-clock">
                        <div role="menu" tabIndex={-1} className="itn-picker-time-clock-mask" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                            <div className="itn-picker-time-clock-pin" style={{ color: theme.palette[props.color!].main }}></div>
                            <div
                                className={`itn-picker-time-clock-pointer ${!mouseDown ? "itn-picker-time-clock-pointer-animation" : ""}`}
                                style={{
                                    height: getPointerHeight(),
                                    transform: getPointerRotation(),
                                    backgroundColor: theme.palette[props.color!].main
                                }}
                            >
                                <div
                                    className={`itn-picker-time-clock-pointer-thumb ${getDeg() % 30 === 0 ? "itn-onclock-text itn-onclock-primary" : "itn-onclock-minute"}`}
                                    style={{
                                        backgroundColor: getDeg() % 30 === 0 ? theme.palette[props.color!].main : undefined,
                                        color: getDeg() % 30 === 0 ? undefined : theme.palette[props.color!].main
                                    }}
                                >
                                </div>
                            </div>
                            <div className={`itn-time-picker-hour itn-time-picker-dial ${currentView !== "hours" ? "itn-time-picker-dial-out itn-time-picker-dial-hidden" : ""}`}>
                                {
                                    props.amPm ?
                                        <>
                                            {/*@*Hours from 1 to 12*@
                                            for(int i = 1; i <= 12; ++i)
                                            {
                                                var _i = i;
                                                var angle =  (6 - _i) * 30;
                                                <MudText Class="@GetNumberColor(_i)" Style="@GetTransform(angle, 109, 0, 5)">@_i</MudText>
                                            }
                                            for(int i = 1; i <= 12; ++i)
                                            {
                                                var _i = i;
                                                <div class="itn-picker-stick itn-hour" style="@($"transform: rotateZ({_i * 30}deg);")" @onclick="(() => OnMouseClickHour(_i))" @onmouseover="(() => OnMouseOverHour(_i))" @onclick:stopPropagation="true"></div>
                                            }*/ }                                            
                                        </> :
                                        <>
                                            {/* Hours from 13 to 24 (00) */}
                                            {
                                                hoursArray.map(h => {
                                                    const _h = h;
                                                    const angle = (6 - _h) * 30;
                                                    return <Typography key={"hour-" + (_h + 12)} sx={theme => getNumberStyle(theme, (_h + 12) % 24, angle, 109, 0, 5)} className="itn-clock-number">{((_h + 12) % 24).toLocaleString("en-US", { minimumIntegerDigits: 2 })}</Typography>;
                                                })
                                            }
                                            {/* Hours from 1 to 12 */}
                                            {
                                                hoursArray.map(h => {
                                                    const _h = h;
                                                    const angle = (6 - _h) * 30;
                                                    return <Typography key={"hour-" + _h} sx={theme => getNumberStyle(theme, _h, angle, 74, 0, 40)} className="itn-clock-number" variant="body2">{_h.toLocaleString("en-US", { minimumIntegerDigits: 2 })}</Typography>;
                                                })
                                            }
                                            {
                                                hoursArray.map(h => {
                                                    const _h = h;
                                                    return <div key={"st" + _h} className="itn-picker-stick" style={{ transform: `rotateZ(${_h * 30}deg` }}>
                                                        <div className="itn-picker-stick-inner itn-hour" onClick={(e) => handleMouseClickHour(e, _h)} onMouseOver={() => handleMouseOverHour(_h)}></div>
                                                        <div className="itn-picker-stick-outer itn-hour" onClick={(e) => handleMouseClickHour(e, (_h + 12) % 24)} onMouseOver={() => handleMouseOverHour((_h + 12) % 24)}></div>
                                                    </div>;
                                                })
                                            }
                                        </>
                                }
                            </div>
                            <div className={`itn-time-picker-minute ${currentView !== "minutes" ? "itn-time-picker-dial-out itn-time-picker-dial-hidden" : ""}`}>   
                                {/* Minutes from 05 to 60 (00) - step 5 */}
                                {
                                    hoursArray.map(h => {
                                        const _h = h - 1;
                                        const angle = (6 - _h) * 30;
                                        return <Typography key={"min-" + _h} sx={theme => getNumberStyle(theme, _h * 5, angle, 109, 0, 5)} className="itn-clock-number" variant="body2">{(_h * 5).toLocaleString("en-US", { minimumIntegerDigits: 2 })}</Typography>;
                                    })
                                }
                                {
                                    minutesArray.map(m => {
                                        const _m = m - 1;
                                        return <div
                                            key={"min-s-" + m}
                                            className="itn-picker-stick itn-minute"
                                            style={{ transform: `rotateZ(${_m * 6}deg)` }}
                                            onClick={(e) => handleMouseClickMinute(e, _m)}
                                            onMouseOver={() => handleMouseOverMinute(_m)}
                                        >
                                        </div>
                                    })
                                }        
                            </div>
                        </div>
                    </div>
                </div>
            </PickerContent>
        </>
    );
}

TimePickerBase.defaultProps = {
    disableToolbar: false,
    className: "",
    color: "primary",
    value: null,
    pickerVariant: "inline",
    autoClose: true,
    readOnly: false,
    onClose: () => { },
    onChange: () => { },
    timeEditMode: "normal",
    amPm: false
};

export default TimePickerBase;