import { Button } from "@mui/material";
import format from "date-fns/format";
import { useState } from "react";
import { ItnDatePicker, ItnTimePicker } from "./pickers/src";

const TestComnonent = () => {
    const [date, setDate] = useState<string>(new Date().toISOString());
    const [time, setTime] = useState<string>(new Date().toISOString());

    return (
        <>
            <div>DatePicker с выбранным значением: {format(new Date(date), "dd MMMM yyyy")}</div>
            <Button onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(newDate.getDate() + 1);
                setDate(newDate.toISOString());
            }}>Увеличить дату</Button>
            <br />
            <ItnDatePicker color="secondary" value={date} onChange={setDate} size="small" label="Выберите дату" />
            <div style={{ marginBottom: 8}}>DatePicker disabled</div>
            <ItnDatePicker color="secondary" value={date} onChange={setDate} size="small" label="Выберите дату" disabled />
            <div style={{ marginBottom: 8 }}>Timepicker с выбранным значением: {format(new Date(time), "HH:mm")}</div>
            <ItnTimePicker color="secondary" value={time} onChange={setTime} size="small" label="Выберите время" />
        </>
    );
}

export default TestComnonent;