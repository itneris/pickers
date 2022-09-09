import React, { useCallback, useMemo, useRef, useState } from "react";
import PickerToolbar from "../common/PickerToolbar";
import PickerContent from "../common/PickerContent";
import IDatePickerProps from "../props/IDatePickerProps";
import { Button, IconButton, Typography } from "@mui/material";
import { format, addMonths, addYears, startOfDay, startOfYear, startOfMonth, startOfWeek, addDays, endOfMonth, eachDayOfInterval, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const DatePicker = (props: IDatePickerProps) => {
    const dayId = useRef<number>(-1);

    const [pickerMonth, setPickerMonth] = useState<Date | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(props.value);
    const [curSelectedDate, setCurSelectedDate] = useState<Date | null>();
    const [currentView, setCurrentView] = useState<"none" | "date" | "year" | "month" | "hours" | "minutes">("none");

    //TODO
    const handleYearClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    }, []);

    //TODO
    const handleYearClicked = useCallback((year: number) => { }, []);

    const getMonthStart = useCallback((month: number): Date => {
        const firstMonthDate = new Date();
        firstMonthDate.setDate(1);
        const monthStartDate = pickerMonth ?? firstMonthDate;
        // Return the min supported datetime of the calendar when this is year 1 and first month!
        if (pickerMonth !== null && pickerMonth.getFullYear() == 1 && pickerMonth.getMonth() == 1) {
            return new Date(1, 1, 1, 0, 0, 0, 0);
        }
        return addMonths(monthStartDate, month);
    }, []);

    const getMonthEnd = useCallback((month: number): Date => {
        const monthStartDate = pickerMonth ?? startOfMonth(new Date());
        return endOfMonth(addMonths(monthStartDate, month));
    }, []);

    const getFormattedYearString = useCallback(() => {
        return format(getMonthStart(0), "yyyy");
    }, [getMonthStart]);

    const getTitleDateString = useCallback((date: Date | null) => {
        if (date === null) {
            return null;
        }
        return format(date, "dd.MM.yyyy");
    }, []);


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
        if (year == getMonthStart(0).getFullYear())
            return "h5";
        return "subtitle1";
    }, [getMonthStart]);

    const getYearClasses = useCallback((year: number) => {
        if (year == getMonthStart(0).getFullYear())
            //TODO посмотреть стили текста
            return `itn-picker-year-selected itn-${props.color}-text`;
        return undefined;
    }, [getMonthStart]);

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
    }, [getYearTypo, getYearClasses, getCalendarYear]);

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
        return format(month, "MMMM");
    }, []);

    const getMonthNameByNumber = useCallback((num: number) => {
        const month = getMonthStart(num);
        return format(month, "MMMM");
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
    }, [getMonthStart]);

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
    }, [handlePreviousYearClick, handleNextYearClick, handleYearClick, getMonthTypo, getMonthClasses, getAbbreviatedMonthName]);

    const getWeek = useCallback((month: number, index: number) => {
        if (index < 0 || index > 5) { 
            throw new Error("Index must be between 0 and 5");
        }
        let weekDays: Date[] = [];
        const monthFirst = getMonthStart(month);
        const weekFirst = startOfWeek(addDays(monthFirst, index * 7));
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
        if ((startOfDay(selectedDate) === day && curSelectedDate === null) || startOfDay(curSelectedDate) === day) {
            classes += " itn-selected";
            classes += ` itn-theme-${props.color}`;
            return classes;
        }
        if (day == startOfDay(new Date())) {
            classes += " itn-current itn-button-outlined";
            classes += ` itn-button-outlined-${props.color} itn-${props.color}-text`;
            return classes;
        }
        return classes;
    }, [getMonthStart, curSelectedDate, selectedDate]);

    //TODO
    const handleDayClicked = useCallback((dateTime: Date) => {
        setCurSelectedDate(dateTime);
        /*if (props.pickerActions === null || props.autoClose || props.pickerVariant === "static")
        {
            Submit();

            if (props.pickerVariant !== "static")
            {
                await Task.Delay(ClosingDelay);
                Close(false);
            }
        }*/
    }, [setCurSelectedDate]);

    const getCalendarDayOfMonth = useCallback((date: Date) => {
        return date.getDate();
    }, []);

    const abbreviatedDayNames = useMemo(() => {
        const now = new Date();
        const daysInWeek = eachDayOfInterval({
            start: startOfWeek(now),
            end: endOfWeek(now)
        });
        const daysNames = daysInWeek.map((d) => format(d, 'ddd'));
        var dayNamesShifted = daysNames; // Shift(dayNamesNormal, (int)GetFirstDayOfWeek());
        return dayNamesShifted;
    }, []);


    const renderDates = useCallback((tempMonth: number) => {
        const prevLabel = `Go to previous month ${getMonthNameByNumber((tempMonth - 1) % 12)}`;
        const nextLabel = `Go to next month ${getMonthNameByNumber((tempMonth + 1) % 12)}`;

        const renderWeeks: JSX.Element[] = [];
        for (let week = 0; week < 6; week++)
        {
            const tempWeek = week;
            const firstMonthFirstYear = pickerMonth !== undefined && pickerMonth.getFullYear() == 1 && pickerMonth.getMonth() == 1;

            if (props.showWeekNumbers)
            {
                renderWeeks.push(<div className="itn-picker-calendar-week">
                    <Typography className="itn-picker-calendar-week-text" variant="caption">@GetWeekNumber(tempMonth, tempWeek)</Typography>
                </div>)
                
            }
            getWeek(tempMonth, tempWeek).forEach(day => {
                const tempId = ++dayId.current;
                
                if (tempId !== 0 || !firstMonthFirstYear) {
                    const selectedDay = !firstMonthFirstYear ? day : addDays(day, -1);
                    renderWeeks.push(
                        <button
                            key={!firstMonthFirstYear ? selectedDay.getDate() : tempId}
                            type="button"
                            //TODO WTF style="--day-id: @(!firstMonthFirstYear ? tempId: tempId + 1);"
                            className={`itn-button-root itn-icon-button itn-ripple itn-ripple-icon itn-picker-calendar-day ${!firstMonthFirstYear || day.getDay() === pickerMonth.getDate() ? getDayClasses(tempMonth, day) : getDayClasses(tempMonth, selectedDay)}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                const d = selectedDay;
                                handleDayClicked(d);
                            }}
                            aria-label={format(selectedDay, "dddd, dd MMMM yyyy")}
                            onMouseOver={(e) => {
                                (e.currentTarget.closest('.mud-picker-calendar-content') as HTMLElement).style['--selected-day'] = !firstMonthFirstYear ? tempId : tempId + 1;
                            }}
                            disabled={(selectedDay < props.minDate) || (selectedDay > props.maxDate) || props.isDateDisabledFunc(selectedDay)}
                        >
                            <p className="itn-typography itn-typography-body2 itn-inherit-text">{getCalendarDayOfMonth(selectedDay)}</p>
                        </button >
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
                            className="itn-button-root itn-icon-button itn-ripple itn-ripple-icon itn-picker-calendar-day itn-day"
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
                        props.fixMonth === undefined ?
                            <>
                                <IconButton 
                                    aria-label={prevLabel}
                                    //TODO CLASSES
                                    className="itn-picker-nav-button-prev itn-flip-x-rtl"
                                    //TODO onClick={handlePreviousMonthClick}
                                >
                                    <ChevronLeft />
                                </IconButton>
                                <button 
                                    type="button"
                                    className="itn-picker-slide-transition itn-picker-calendar-header-transition itn-button-month"
                                    onClick={(e) => {
                                        //TODO handleMonthClicked(tempMonth);
                                        e.stopPropagation();
                                    }}
                                >
                                    <Typography variant="body1" align="center">{getMonthNameByNumber(tempMonth)}</Typography>
                                </button>
                                <IconButton 
                                    aria-label={nextLabel}
                                    className="itn-picker-nav-button-next itn-flip-x-rtl"
                                    //TODO onClick={handleNextMonthClick}
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
                        abbreviatedDayNames.map(dayname => <Typography variant="caption" className="itn-day-label">{dayname}</Typography>)
                    }
                </div>
            </div>
            <div className="itn-picker-calendar-transition itn-picker-slide-transition">
                <div className="itn-picker-calendar">
                    {renderWeeks}
                </div>
            </div>
        </>);
    }, [getMonthNameByNumber, pickerMonth, props.showWeekNumbers, props.isDateDisabledFunc, getCalendarDayOfMonth, getWeek]);

    const renderPickerContent = useMemo(() => {
        if (pickerMonth !== null && pickerMonth.getFullYear() === 1 && pickerMonth.getMonth() === 1) {
            dayId.current = -1;
        }
        let content: React.ReactNode[] = [];
        for (let displayMonth = 0; displayMonth < props.displayMonths; ++displayMonth) {
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
    }, [pickerMonth, currentView]);

    return (
        <>
            <PickerToolbar className="itn-picker-datepicker-toolbar" disableToolbar={props.disableToolbar} orientation={props.orientation} color={props.color}>
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

DatePicker.defaultProps = {
    disableToolbar: false,
    className: "",
    orientation: "portrait",
    color: "primary",
    displayMonths: 1,
    showWeekNumbers: false,
    isDateDisabledFunc: () => false
};

export default DatePicker;