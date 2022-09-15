import "./DatePickerBase.css";
import "../common/base.css";
import React, { ButtonHTMLAttributes, useCallback, useMemo, useRef, useState } from "react";
import PickerToolbar from "../common/PickerToolbar";
import PickerContent from "../common/PickerContent";
import IDatePickerBaseProps from "../props/IDatePickerBaseProps";
import { Button, IconButton, styled, Theme, Typography, useTheme } from "@mui/material";
import { format, addMonths, addYears, startOfDay, startOfYear, startOfMonth, startOfWeek, addDays, endOfMonth, eachDayOfInterval, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
const { ru } = require('date-fns/locale');

const DayText = styled('p')(
    ({ theme }: { theme: Theme }) => ({
        fontFamily: theme.typography.body2.fontFamily,
        fontSize: theme.typography.body2.fontSize,
        fontWeight: theme.typography.body2.fontWeight,
        letterSpacing: theme.typography.body2.letterSpacing,
        lineHeight: theme.typography.body2.lineHeight,
        color: "inherit"
    })
);

interface IDayButtonProps extends React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    selected: boolean,
    current: boolean,
    color: "success" | "error" | "primary" | "secondary" | "info"
}

const DayButton = styled('button', {
    shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'current' && prop !== "color"
})<IDayButtonProps>(
    ({ theme, selected, current, color }: { theme: Theme, selected: boolean, current: boolean, color: "success" | "error" | "primary" | "secondary" | "info" }) => ({
        color: selected ? `${theme.palette[color].contrastText} !important` : undefined,
        backgroundColor: selected ? theme.palette[color].main : undefined,
        border: current ? `1px solid ${theme.palette[color].main}` : undefined,
        "&:hover": {
            backgroundColor: selected ? undefined : theme.palette.action.hover
        }
    })
)

const DatePickerBase = (props: IDatePickerBaseProps) => {
    const dayId = useRef<number>(-1);
    const theme = useTheme();

    const [pickerMonth, setPickerMonth] = useState<Date | null>(props.value === null ? null : startOfMonth(new Date(props.value)));
    const [selectedDate, setSelectedDate] = useState<Date | null>(props.value === null ? null : new Date(props.value));
    const [currentView, setCurrentView] = useState<"date" | "year" | "month" | "hours" | "minutes">("date");

    //TODO
    const handleYearClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    }, []);

    //TODO
    const handleYearClicked = useCallback((year: number) => { }, []);

    const getMonthStart = useCallback((month: number): Date => {
        const monthStartDate = pickerMonth ?? startOfMonth(new Date());
        // Return the min supported datetime of the calendar when this is year 1 and first month!
        if (pickerMonth !== null && pickerMonth.getFullYear() === 1 && pickerMonth.getMonth() === 1) {
            return new Date(1, 1, 1, 0, 0, 0, 0);
        }
        return addMonths(monthStartDate, month);
    }, [pickerMonth]);

    const getMonthEnd = useCallback((month: number): Date => {
        const monthStartDate = pickerMonth ?? startOfMonth(new Date());
        return endOfMonth(addMonths(monthStartDate, month));
    }, [pickerMonth]);

    const getFormattedYearString = useCallback(() => {
        return format(getMonthStart(0), "yyyy");
    }, [getMonthStart]);

    const getTitleDateString = useCallback((date: Date | null) => {
        const dateToFormat = date ?? selectedDate;
        if (dateToFormat === null) {
            return "";
        }
        return format(dateToFormat, "eee, dd MMM", { locale: ru });
    }, [selectedDate]);


    //TODO
    const handleFormattedDateClick = useCallback(() => { }, []);

    const minYear = useMemo(() => {
        if (props.minDate) {
            return props.minDate.getFullYear();
        }
        const date = new Date();
        return addYears(startOfDay(date), -100).getFullYear();
    }, [props.minDate]);

    const maxYear = useMemo(() => {
        if (props.maxDate) {
            return props.maxDate.getFullYear();
        }
        const date = new Date();
        return addYears(startOfDay(date), 100).getFullYear();
    }, [props.maxDate]);

    const getYearTypo = useCallback((year: number) => {
        if (year === getMonthStart(0).getFullYear())
            return "h5";
        return "subtitle1";
    }, [getMonthStart]);

    const getYearClasses = useCallback((year: number) => {
        if (year === getMonthStart(0).getFullYear())
            //TODO посмотреть стили текста
            return `itn-picker-year-selected itn-${props.color}-text`;
        return undefined;
    }, [getMonthStart, props.color]);

    const getCalendarYear = useCallback((year: number) => {
        const date = selectedDate ?? startOfDay(new Date());
        const diff = date.getFullYear() - year;
        const calenderYear = date.getFullYear();
        return calenderYear - diff;
    }, [selectedDate]);

    const renderYears = useMemo(() => {
        let years: React.ReactNode[] = [];
        for (let i = minYear; i <= maxYear; i++) {
            const year = i;
            years.push(
                <div
                    className="itn-picker-year"
                    id={"_componentId" + year}
                    key={"_componentId" + year}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleYearClicked(year);
                    }}
                >
                    <Typography variant={getYearTypo(year)} className={getYearClasses(year)}>{getCalendarYear(year)}</Typography>
                </div>
            );
        }
        return years;
    }, [getYearTypo, getYearClasses, getCalendarYear, handleYearClicked, maxYear, minYear]);

    const allMonths = useMemo(() => {
        const current = getMonthStart(0);
        const calendarYear = current.getFullYear();;
        const firstOfCalendarYear = startOfYear(new Date(calendarYear, 1));
        let months: Date[] = [];
        for (let i = 0; i < 12; i++) {
            months.push(addMonths(firstOfCalendarYear, i));
        }
        return months;
    }, [getMonthStart]);

    const getMonthName = useCallback((month: Date) => {
        return format(month, "LLLL", { locale: ru });
    }, []);

    const getMonthNameByNumber = useCallback((num: number) => {
        const month = getMonthStart(num);
        return format(month, "LLLL yyyy", { locale: ru });
    }, [getMonthStart]);

    const getNextView = useCallback(() => {
        let nextView: "year" | "month" | "date" | null;
        switch (currentView) {
            case "year": {
                nextView = props.fixMonth === undefined ? "month" : props.fixDay === undefined ? "date" : null;
                break;
            }
            case "month": {
                nextView = props.fixDay === undefined ? "date" : null;
                break;
            }
            default: {
                nextView = null;
            }             
        };
        return nextView;
    }, [currentView, props.fixMonth, props.fixDay]);

    const handleMonthSelected = useCallback((month: Date) => {
        setPickerMonth(month);
        const nextView = getNextView();
        if (nextView != null) {
            setCurrentView(nextView);
        }
    }, [setPickerMonth, getNextView, setCurrentView]);

    const getMonthTypo = useCallback((month: Date) => {
        if (getMonthStart(0) === month)
            return "h5";
        return "subtitle1";
    }, [getMonthStart]);

    const getMonthClasses = useCallback((month: Date) => {
        if (getMonthStart(0) === month)
            //TODO посмотреть стили текста
            return `itn-picker-month-selected itn-${props.color}-text`;
        return undefined;
    }, [getMonthStart, props.color]);

    const getAbbreviatedMonthName = useCallback((month: Date) => {
        return format(month, "MM");
    }, []);

    const handlePreviousYearClick = useCallback(() => {
        setPickerMonth(addYears(getMonthStart(0), -1));
    }, [setPickerMonth, getMonthStart]);

    const handleNextYearClick = useCallback(() => {
        setPickerMonth(addYears(getMonthStart(0), 1));
    }, [setPickerMonth, getMonthStart]);

    const renderMonths = useMemo(() => {
        const calendarYear = getCalendarYear(pickerMonth?.getFullYear() ?? startOfDay(new Date()).getFullYear());
        const prevLabel = `Go to previous year ${calendarYear - 1}`;
        const nextLabel = `Go to next year ${calendarYear + 1}`;

        const months: React.ReactNode[] = [];

        allMonths.forEach(month => {
            months.push(
                <button
                    type="button"
                    aria-label={getMonthName(month)}
                    className="itn-picker-month"
                    onClick={() => handleMonthSelected(month)}
                    //@onclick: stopPropagation = "true"
                >
                    <Typography variant={getMonthTypo(month)} className={getMonthClasses(month)}>{getAbbreviatedMonthName(month)}</Typography>
                </button>
            );
        });

        return (<>
            <div className="itn-picker-calendar-header">
                <div className="itn-picker-calendar-header-switch">
                    {
                        props.fixYear !== undefined ?
                            <>
                                <IconButton 
                                    aria-label={prevLabel}
                                    onClick={handlePreviousYearClick}
                                    //TODO checkClass
                                    className="itn-flip-x-rtl"
                                >
                                    <ChevronLeft />
                                </IconButton>
                                <button 
                                    type="button" 
                                    className="itn-picker-slide-transition itn-picker-calendar-header-transition"
                                    onClick={handleYearClick}
                                >
                                    <Typography variant="body1" align="center">{calendarYear}</Typography>
                                </button>
                                <IconButton 
                                    aria-label={nextLabel} 
                                    onClick={handleNextYearClick}
                                    //TODO checkClass
                                    className="itn-flip-x-rtl"
                                >
                                    <ChevronRight />
                                </IconButton>
                            </> :
                            <Typography className="itn-picker-calendar-header-transition" variant="body1" align="center">{calendarYear}</Typography>
                    }
                </div>
            </div>
            <div className="itn-picker-month-container">
            </div>
        </>);
    }, [handlePreviousYearClick, handleNextYearClick, handleYearClick, getMonthTypo, getMonthClasses, getAbbreviatedMonthName, allMonths, getCalendarYear, getMonthName, handleMonthSelected, pickerMonth, props.fixYear]);

    const getWeek = useCallback((month: number, index: number) => {
        if (index < 0 || index > 5) { 
            throw new Error("Index must be between 0 and 5");
        }
        let weekDays: Date[] = [];
        const monthFirst = getMonthStart(month);
        const weekFirst = startOfWeek(addDays(monthFirst, index * 7), { locale: ru });
        for (let i = 0; i < 7; i++) {
            weekDays.push(addDays(weekFirst, i));
        }
        return weekDays;
    }, [getMonthStart]);

    const getDayClasses = useCallback((month: number, day: Date) => {
        let classes = "itn-day";
        if (day < getMonthStart(month) || day > getMonthEnd(month)) {
            classes += " itn-hidden";
            return classes
        }
        if ((selectedDate === null && props.value !== null && startOfDay(new Date(props.value!)).getTime() === startOfDay(day).getTime()) || (selectedDate !== null && startOfDay(selectedDate).getTime() === startOfDay(day).getTime())) {
            classes += " itn-selected";
            classes += ` selected-day`;
            return classes;
        }
        if (startOfDay(day).getTime() === startOfDay(new Date()).getTime()) {
            classes += " itn-current itn-button-outlined";
            classes += ` current-day`;
            return classes;
        }
        return classes;
    }, [getMonthStart, props.value, selectedDate, getMonthEnd]);

    const submitValue = useCallback((dateTime: Date) => {
        if (props.readOnly) {
            return;
        }

        let changedDate = dateTime;

        if (props.fixYear !== null || props.fixMonth !== null || props.fixDay !== null) {
            changedDate = new Date(props.fixYear ?? dateTime.getFullYear(),
                props.fixMonth ?? dateTime.getMonth(),
                props.fixDay ?? dateTime.getDate(),
                dateTime.getHours(),
                dateTime.getMinutes(),
                dateTime.getSeconds(),
                dateTime.getMilliseconds());
        }

        props.onChange!(changedDate.toISOString());
        //setSelectedDate(changedDate);
    }, [props.readOnly, props.fixDay, props.fixMonth, props.fixYear, props.onChange]);

    //TODO
    const handleDayClicked = useCallback((dateTime: Date) => {
        setSelectedDate(dateTime);
        if (props.pickerActions === undefined || props.autoClose || props.pickerVariant === "static")
        {
            submitValue(dateTime);

            if (props.pickerVariant !== "static")
            {
                props.onClose!(false);
            }
        }
    }, [setSelectedDate, submitValue, props.onClose, props.autoClose, props.pickerVariant, props.pickerActions]);

    const getCalendarDayOfMonth = useCallback((date: Date) => {
        return date.getDate();
    }, []);

    const abbreviatedDayNames = useMemo(() => {
        const now = new Date();
        const daysInWeek = eachDayOfInterval({
            start: startOfWeek(now),
            end: endOfWeek(now)
        });
        const daysNames = daysInWeek.map((d) => format(d, 'eee', { locale: ru }));
        const firstDay = daysNames.shift();
        const dayNamesShifted = [...daysNames, firstDay]; //TODO shift not-hardcode Shift(dayNamesNormal, (int)GetFirstDayOfWeek());
        return dayNamesShifted;
    }, []);

    const handlePreviousMonthClick = useCallback(() => {
        if (pickerMonth !== null && pickerMonth.getFullYear() === 1 && pickerMonth.getMonth() === 1) {
            return;
        }
        setPickerMonth(startOfMonth(addDays(getMonthStart(0), -1)));
    }, [setPickerMonth, getMonthStart, pickerMonth]);

    const handleNextMonthClick = useCallback(() => {
        setPickerMonth(addDays(getMonthEnd(0), 1));
    }, [setPickerMonth, getMonthEnd]);

    const handleMonthClicked = useCallback((month: number) => {
        setCurrentView("month");
        setPickerMonth(pickerMonth === null ? null : addMonths(pickerMonth, month));
    }, [setPickerMonth, pickerMonth, setCurrentView]);

    const renderDates = useCallback((tempMonth: number) => {
        const prevLabel = `Go to previous month ${getMonthNameByNumber((tempMonth - 1) % 12)}`;
        const nextLabel = `Go to next month ${getMonthNameByNumber((tempMonth + 1) % 12)}`;

        const renderWeeks: JSX.Element[] = [];
        for (let week = 0; week < 6; week++)
        {
            const tempWeek = week;
            const firstMonthFirstYear = pickerMonth !== null && pickerMonth.getFullYear() === 1 && pickerMonth.getMonth() === 1;

            if (props.showWeekNumbers)
            {
                renderWeeks.push(<div className="itn-picker-calendar-week">
                    <Typography className="itn-picker-calendar-week-text" variant="caption">{/*getWeekNumber(tempMonth, tempWeek)*/}</Typography>
                </div>)
                
            }
            getWeek(tempMonth, tempWeek).forEach(day => {
                const tempId = ++dayId.current;
                
                if (tempId !== 0 || !firstMonthFirstYear) {
                    const selectedDay = !firstMonthFirstYear ? day : addDays(day, -1);
                    let classes = !firstMonthFirstYear || day.getDate() === pickerMonth?.getDate() ? getDayClasses(tempMonth, day) : getDayClasses(tempMonth, selectedDay);
                    const isSelected = classes.includes('selected-day');
                    const isCurrent = classes.includes('current-day');
                    classes = classes.replace(" selected-day", "").replace("current-day", "");
                    renderWeeks.push(
                        <DayButton
                            selected={isSelected}
                            current={isCurrent}
                            color={props.color!}
                            key={!firstMonthFirstYear ? selectedDay.toISOString() : tempId}
                            type="button"
                            //TODO WTF style="--day-id: @(!firstMonthFirstYear ? tempId: tempId + 1);"
                            //className={`itn-button-root itn-icon-button itn-ripple itn-ripple-icon itn-picker-calendar-day ${!firstMonthFirstYear || day.getDay() === pickerMonth.getDate() ? getDayClasses(tempMonth, day) : getDayClasses(tempMonth, selectedDay)}`}
                            className={`itn-icon-button itn-ripple itn-ripple-icon itn-picker-calendar-day ${classes}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                const d = selectedDay;
                                handleDayClicked(d);
                            }}
                            style={{
                                color: theme.palette.text.primary
                            }}
                            aria-label={format(selectedDay, "eeee, dd MMMM yyyy", { locale: ru })}
                            onMouseOver={(e) => {
                                //@ts-ignore
                                (e.currentTarget.closest('.itn-picker-calendar-content') as HTMLElement).style['--selected-day'] = !firstMonthFirstYear ? tempId : tempId + 1;
                            }}
                            disabled={(selectedDay < props.minDate!) || (selectedDay > props.maxDate!) || props.isDateDisabledFunc!(selectedDay)}
                        >
                            <DayText>{getCalendarDayOfMonth(selectedDay)}</DayText>
                        </DayButton>
                    );
                }
                else {
                    renderWeeks.push(
                        <button
                            key="0"
                            type="button"
                            style={{
                                //@ts-ignore
                                "--day-id": "1"
                            }}
                            //className="itn-button-root itn-icon-button itn-ripple itn-ripple-icon itn-picker-calendar-day itn-day"
                            className="itn-ripple itn-ripple-icon itn-picker-calendar-day itn-day"
                            aria-label=''
                            disabled
                        >
                            <p className="itn-typography itn-typography-body2 itn-inherit-text"></p>
                        </button>
                    )
                }
            })
        }

        return (<>
            <div /*TODO className={getCalendarHeaderClasses(tempMonth)}*/>
                <div className="itn-picker-calendar-header-switch">
                    {
                        props.fixMonth === null ?
                            <>
                                <IconButton 
                                    aria-label={prevLabel}
                                    sx={{m: 1}}
                                    //TODO CLASSES itn-flip-x-rtl
                                    className="itn-picker-nav-button-prev itn-flip-x-rtl"
                                    onClick={handlePreviousMonthClick}
                                >
                                    <ChevronLeft />
                                </IconButton>
                                <button 
                                    type="button"
                                    className="itn-picker-slide-transition itn-picker-calendar-header-transition itn-button-month"
                                    onClick={(e) => {
                                        handleMonthClicked(tempMonth);
                                        e.stopPropagation();
                                    }}
                                >
                                    <Typography variant="body1" align="center">{getMonthNameByNumber(tempMonth)}</Typography>
                                </button>
                                <IconButton
                                    sx={{ m: 1 }}
                                    aria-label={nextLabel}
                                    //TODO CLASSES itn-flip-x-rtl
                                    className="itn-picker-nav-button-next itn-flip-x-rtl"
                                    onClick={handleNextMonthClick}
                                >
                                    <ChevronRight />
                                </IconButton>
                            </> : 
                            <Typography className="itn-picker-calendar-header-transition" variant="body1" align="center">{getMonthNameByNumber(tempMonth)}</Typography>
                    }
                </div>
                <div className="itn-picker-calendar-header-day">
                    {
                        props.showWeekNumbers &&
                        <div className="itn-picker-calendar-week">
                            <Typography variant="caption" className="itn-picker-calendar-week-text"></Typography>
                        </div>
                    }
                    {
                        abbreviatedDayNames.map(dayname => <Typography key={"ds-" + dayname} color="textSecondary" variant="caption" className="itn-day-label">{dayname}</Typography>)
                    }
                </div>
            </div>
            <div className="itn-picker-calendar-transition itn-picker-slide-transition">
                <div className="itn-picker-calendar">
                    {renderWeeks}
                </div>
            </div>
        </>);
    }, [handleNextMonthClick, handlePreviousMonthClick, getMonthNameByNumber, pickerMonth, props.showWeekNumbers, props.isDateDisabledFunc, getCalendarDayOfMonth, getWeek, props.color, getDayClasses, abbreviatedDayNames, handleDayClicked, props.fixMonth, props.maxDate, props.minDate, theme.palette.text.primary]);

    const renderPickerContent = useMemo(() => {
        if (pickerMonth !== null && pickerMonth.getFullYear() === 1 && pickerMonth.getMonth() === 1) {
            dayId.current = -1;
        }
        let content: React.ReactNode[] = [];
        for (let displayMonth = 0; displayMonth < props.displayMonths!; ++displayMonth) {
            const tempMonth = displayMonth;
            content.push(
                <div key={"itn-m-" + displayMonth} className="itn-picker-calendar-container">
                    {
                        tempMonth === 0 && currentView === "year" ?
                            <div id="pickerYears" className="itn-picker-year-container">
                                {renderYears}
                            </div> :
                            tempMonth === 0 && currentView === "month" ?
                                renderMonths : 
                                currentView === "date" || tempMonth > 0 ?
                                    renderDates(tempMonth) : null
                    }           
                </div>
            );
        }
        return content;
    }, [pickerMonth, currentView, props.displayMonths, renderDates, renderMonths, renderYears]);

    return (
        <>
            <PickerToolbar className="itn-picker-datepicker-toolbar" disableToolbar={props.disableToolbar} orientation={props.orientation} color={props.color!}>
                <Button variant="text" color="inherit" className="itn-button-year" onClick={handleYearClick}>{getFormattedYearString()}</Button>
                <Button variant="text" color="inherit" className="itn-button-date" onClick={handleFormattedDateClick}>{getTitleDateString(null)}</Button>
            </PickerToolbar>
            <PickerContent>
                <div className={`itn-picker-calendar-content itn-picker-calendar-content-${props.maxMonthColumns ?? props.displayMonths}`}>
                    {
                        <div className="itn-picker-calendar-container">
                            {renderPickerContent}
                        </div>
                    }
                </div>
            </PickerContent>
        </>
    );
}

DatePickerBase.defaultProps = {
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
    onChange: () => { }
};

export default DatePickerBase;