import { Button, Paper } from "@mui/material";
import format from "date-fns/format";
import React, { useState } from "react";
import { ItnDatePicker } from "./pickers/src";

const TestComnonent = () => {
    const [date, setDate] = useState<string>(new Date().toISOString());

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
        </>
    );
}

export default TestComnonent;